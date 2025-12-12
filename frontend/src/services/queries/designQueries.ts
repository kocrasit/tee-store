import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Query keys
export const designKeys = {
  all: ['designs'] as const,
  lists: () => [...designKeys.all, 'list'] as const,
  list: (filters: object) => [...designKeys.lists(), filters] as const,
  details: () => [...designKeys.all, 'detail'] as const,
  detail: (id: string) => [...designKeys.details(), id] as const,
  admin: () => [...designKeys.all, 'admin'] as const,
  influencer: () => [...designKeys.all, 'influencer'] as const,
};

interface DesignListParams {
  pageNumber?: number;
  keyword?: string;
}

// Get designs list
export function useDesigns(params: DesignListParams = {}) {
  return useQuery({
    queryKey: designKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.pageNumber) searchParams.set('pageNumber', String(params.pageNumber));
      if (params.keyword) searchParams.set('keyword', params.keyword);

      const res = await api.get(`/designs?${searchParams.toString()}`);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Get single design
export function useDesign(id: string, enabled = true) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: async () => {
      const res = await api.get(`/designs/${id}`);
      return res.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Get all designs for admin
export function useAdminDesigns() {
  return useQuery({
    queryKey: designKeys.admin(),
    queryFn: async () => {
      const res = await api.get('/designs/admin');
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
  });
}

// Get influencer's own designs
export function useInfluencerDesigns() {
  return useQuery({
    queryKey: designKeys.influencer(),
    queryFn: async () => {
      const res = await api.get('/influencer/designs');
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
  });
}

// Infinite scroll için (opsiyonel)
export function useInfiniteDesigns(keyword?: string) {
  return useInfiniteQuery({
    queryKey: designKeys.list({ keyword, infinite: true }),
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams();
      searchParams.set('pageNumber', String(pageParam));
      if (keyword) searchParams.set('keyword', keyword);

      const res = await api.get(`/designs?${searchParams.toString()}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

