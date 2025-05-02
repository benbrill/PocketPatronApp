import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';
import ShowCard from './ShowCard';

export default function DisplayShows() {
  const [shows, setShows] = useState<{ show_id: number; title: string; description: string, season: number, image_filename: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      const { data, error } = await supabase.from('shows').select('show_id, title, description, season, image_filename').order('season', { ascending: false }).limit(12);
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
            <ShowCard key={show.show_id} show={show} />
          ))}
        </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
