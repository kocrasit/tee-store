"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditDesignPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
    });

    const { data: design, isLoading } = useQuery({
        queryKey: ['design', id],
        queryFn: async () => {
            const res = await api.get(`/designs/${id}`);
            return res.data;
        },
    });

    useEffect(() => {
        if (design) {
            setFormData({
                title: design.title || '',
                description: design.description || '',
                price: design.price || 0,
                category: design.category || '',
                stock: design.stock || 0,
            });
        }
    }, [design]);

    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await api.put(`/designs/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            alert('Tasarım başarıyla güncellendi!');
            router.push('/influencer/designs');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Güncelleme başarısız.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/influencer/designs"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tasarım Düzenle</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            <option value="">Kategori Seçin</option>
                            <option value="tshirt">T-Shirt</option>
                            <option value="hoodie">Hoodie</option>
                            <option value="sweatshirt">Sweatshirt</option>
                            <option value="mug">Kupa</option>
                            <option value="poster">Poster</option>
                            <option value="sticker">Sticker</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Kaydet
                    </button>
                    <Link
                        href="/influencer/designs"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    );
}
