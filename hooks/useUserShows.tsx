import { useAuth } from '@/components/ctx';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';


export function useUserShows() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['user_shows', session?.user.id],
    queryFn: async () => {
      if (!session) return [];

      const { data, error } = await supabase
        .from('user_shows')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    },
  });
}