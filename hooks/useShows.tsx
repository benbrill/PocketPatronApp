import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export function useShows(limit = 12) {
    return useQuery({
      queryKey: ['shows', limit],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .order('season', { ascending: false })
          .limit(limit);
        if (error) throw error;
        return data;
      },
    });
  }
  