import { supabase } from '@/lib/supabase'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'
import { Input, Text, View, YStack } from 'tamagui'
import ShowCard from './ShowCard'

type Show = {
  show_id: number
  title: string
  description: string
  season: number
  image_filename: string
}

const PAGE_SIZE = 12

export default function DisplayShows() {
  const [query, setQuery] = useState('')
  const [shows, setShows] = useState<Show[]>([])
  const [searchResults, setSearchResults] = useState<Show[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Infinite scroll loader
  const fetchNextPage = async () => {
    if (loading || !hasMore || query) return
    setLoading(true)
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('shows')
      .select('show_id, title, description, season, image_filename')
      .order('season', { ascending: false })
      .range(from, to)

    if (!error && data) {
      setShows(prev => [...prev, ...data])
      setPage(prev => prev + 1)
      if (data.length < PAGE_SIZE) setHasMore(false)
    }

    setLoading(false)
  }

  // Server-side filtering + Fuse
  const fetchSearchResults = async (q: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shows')
      .select('show_id, title, description, season, image_filename')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(100)

    if (!error && data) {
      const fuse = new Fuse(data, {
        keys: ['title', 'description'],
        threshold: 0.3,
      })
      const results = fuse.search(q).map(r => r.item)
      setSearchResults(results)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchNextPage()
  }, [])

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.length >= 2) {
      fetchSearchResults(q)
    } else {
      setSearchResults([])
    }
  }

  const dataToRender = query.length >= 2 ? searchResults : shows

  return (
    <YStack f={1} px="$4" py="$4">
      <Input
        placeholder="Search shows..."
        value={query}
        onChangeText={handleSearch}
        mb="$4"
      />

      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.show_id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => <ShowCard show={item} />}
        onEndReached={query ? undefined : fetchNextPage}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          loading ? (
            <View ai="center" jc="center" py="$4">
              <ActivityIndicator size="small" color="#888" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && dataToRender.length === 0 ? (
            <Text textAlign="center" color="$color" mt="$4">
              No shows found.
            </Text>
          ) : null
        }
      />
    </YStack>
  )
}
