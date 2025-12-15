'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { Loader2, Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminBanners() {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [newBanner, setNewBanner] = useState({ title: '', link: '', order: 0 });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data: banners, isLoading } = useQuery({
        queryKey: ['admin-banners'],
        queryFn: async () => {
            const res = await api.get('/banners/admin');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post('/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
            setIsCreating(false);
            setNewBanner({ title: '', link: '', order: 0 });
            setSelectedFile(null);
            setPreview(null);
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Hata oluştu'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/banners/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return alert('Lütfen bir görsel seçin');

        const formData = new FormData();
        formData.append('title', newBanner.title);
        formData.append('image', selectedFile);
        if (newBanner.link) formData.append('link', newBanner.link);
        formData.append('order', String(newBanner.order));

        createMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Reklam Panoları (Banners)</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-gold transition-colors"
                >
                    <Plus className="w-4 h-4" /> Yeni Ekle
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Başlık</label>
                            <input
                                type="text"
                                value={newBanner.title}
                                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Link (Opsiyonel)</label>
                            <input
                                type="text"
                                placeholder="/products/new-season"
                                value={newBanner.link}
                                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sıra</label>
                            <input
                                type="number"
                                value={newBanner.order}
                                onChange={(e) => setNewBanner({ ...newBanner, order: Number(e.target.value) })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Görsel (Banner için yatay görsel önerilir)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative h-40">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="w-8 h-8 mx-auto mb-2" />
                                        <span>Görsel Yükle</span>
                                    </div>
                                )}
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-gray-500 hover:text-black"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-wider"
                        >
                            {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners?.map((banner: any) => (
                    <div key={banner._id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-[16/9] bg-gray-100 relative">
                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${banner.image}`} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => {
                                        if (confirm('Silmek istediğinize emin misiniz?')) deleteMutation.mutate(banner._id);
                                    }}
                                    className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{banner.title}</h3>
                                    <p className="text-xs text-gray-500">Link: {banner.link || '-'}</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">
                                    #{banner.order}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
