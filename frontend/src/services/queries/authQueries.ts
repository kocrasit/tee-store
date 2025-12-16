import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Get current user profile
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const res = await api.get('/auth/profile');
      return res.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 dakika
    retry: false,
  });
}



