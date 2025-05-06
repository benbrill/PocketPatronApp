import { supabase } from '@/lib/supabase';
import { useInfiniteQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Input, Text, View, YStack } from 'tamagui';
import ShowCard from './ShowCard';

const PAGE_SIZE = 12;

type Show = {
  show_id: number;
  title: string;
  description: string;
  season: number;
  image_filename: string;
};

// Query hook for infinite loading
const useShows = () => {
  return useInfiniteQuery({
    queryKey: ['shows'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from('shows')
        .select('show_id, title, description, season, image_filename')
        .order('season', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data, nextPage: pageParam + 1, hasMore: data.length === PAGE_SIZE };
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    initialPageParam: 0,
  });
};

export default function DisplayShows() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useShows();

  const allShows: Show[] = data?.pages.flatMap(page => page.data) ?? [];

  // Search logic with Fuse
  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) return setSearchResults([]);

    const { data, error } = await supabase
      .from('shows')
      .select('show_id, title, description, season, image_filename')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(100);

    if (!error && data) {
      const fuse = new Fuse(data, {
        keys: ['title', 'description'],
        threshold: 0.3,
      });
      setSearchResults(fuse.search(q).map(r => r.item));
    }
  };

  const dataToRender = query.length >= 2 ? searchResults : allShows;

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
        onEndReached={query ? undefined : () => fetchNextPage()}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View ai="center" jc="center" py="$4">
              <ActivityIndicator size="small" color="#888" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && dataToRender.length === 0 ? (
            <Text textAlign="center" color="$color" mt="$4">
              No shows found.
            </Text>
          ) : null
        }
      />
    </YStack>
  );
}
