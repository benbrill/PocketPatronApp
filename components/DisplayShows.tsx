import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Image, ScrollView, Text, View, XStack, YStack } from 'tamagui';

export default function DisplayShows() {
  const [shows, setShows] = useState<{ show_id: number; title: string; description: string, season: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      const { data, error } = await supabase.from('shows').select('*');
      if (error) {
        console.error('Error fetching shows:', error);
      } else {
        setShows(data || []);
      }
      setLoading(false);
    }

    fetchShows();
  }, []);

  if (loading) {
    return (
      <View f={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#888" />
        <Text>Loading shows...</Text>
      </View>
    );
  }

  return (
    <YStack f={1}>
      <ScrollView f={1} showsHorizontalScrollIndicator={false}>
        <YStack px="$4" py="$4">
        <XStack flexWrap="wrap" justifyContent="space-between">
          {shows.map((show) => (
            <YStack key={show.show_id} alignItems='center' mb="$4" width="33%">
              <Image
                source={{
                  uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/2003_Wicked.png`,
                }}
                width={100}
                height={150}
              />
              <Text fontSize="$6" fontWeight="bold">
                {show.title}
              </Text>
              <Text>{show.season}</Text>
            </YStack>
          ))}
        </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
