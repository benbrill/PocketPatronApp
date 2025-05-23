import { useAuth } from '@/components/ctx';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export function useUserProfile(userId?: string | null) {

  const { session } = useAuth();
  // If no userId is provided, use the session user ID
  if (!userId) {
    userId = session?.user.id;
  }
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
