import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { designKeys } from '../queries/designQueries';

interface CreateDesignInput {
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  stock?: number;
  image?: File;
}

// Create design mutation
export function useCreateDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDesignInput) => {
      const formData = new FormData();
      formData.append('title', input.title);
      formData.append('description', input.description);
      formData.append('price', String(input.price));
      formData.append('category', input.category);
      if (input.tags) formData.append('tags', input.tags.join(','));
      if (input.stock !== undefined) formData.append('stock', String(input.stock));
      if (input.image) formData.append('image', input.image);

      const res = await api.post('/designs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.all });
    },
  });
}

// Update design mutation
export function useUpdateDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      stock?: number;
      status?: string;
    }) => {
      const res = await api.put(`/designs/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: designKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
    },
  });
}

// Delete design mutation
export function useDeleteDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/designs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.all });
    },
  });
}

// Create review mutation
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      designId,
      rating,
      comment,
    }: {
      designId: string;
      rating: number;
      comment: string;
    }) => {
      const res = await api.post(`/designs/${designId}/reviews`, { rating, comment });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: designKeys.detail(variables.designId) });
    },
  });
}



