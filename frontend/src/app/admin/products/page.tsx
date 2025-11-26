"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { Loader2, Trash2, Plus, Minus, Package, Building2, Users, Edit2 } from 'lucide-react';
import Link from 'next/link';

type TabType = 'all' | 'company' | 'influencer';

export default function AdminProductsPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

    const { data: designs, isLoading, error } = useQuery({
        queryKey: ['adminDesigns'],
        queryFn: async () => {
            const res = await api.get('/designs/admin');
            return res.data;
        }
    });

    const deleteDesignMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/designs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminDesigns'] });
            alert('Ürün başarıyla silindi.');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Silme işlemi başarısız.');
        }
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
            const res = await api.put(`/designs/${id}/stock`, { stock });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminDesigns'] });
            setUpdatingStockId(null);
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Stok güncelleme başarısız.');
            setUpdatingStockId(null);
        }
    });

    const handleDelete = (id: string, title: string) => {
        if (confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) {
            deleteDesignMutation.mutate(id);
        }
    };

    const handleStockChange = (id: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        setUpdatingStockId(id);
        updateStockMutation.mutate({ id, stock: newStock });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Ürünler yüklenirken bir hata oluştu.
            </div>
        );
    }

    // Filter designs based on active tab
    const filteredDesigns = designs?.filter((design: any) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'company') return design.userRole !== 'influencer';
        if (activeTab === 'influencer') return design.userRole === 'influencer';
        return true;
    }) || [];

    const tabs = [
        { id: 'all' as TabType, label: 'Tümü', icon: Package, count: designs?.length || 0 },
        { id: 'company' as TabType, label: 'Şirket Tasarımları', icon: Building2, count: designs?.filter((d: any) => d.userRole !== 'influencer').length || 0 },
        { id: 'influencer' as TabType, label: 'Influencer Tasarımları', icon: Users, count: designs?.filter((d: any) => d.userRole === 'influencer').length || 0 },
    ];

    const getImageUrl = (path: string) => {
        if (!path) return 'https://via.placeholder.com/150';
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/\\/g, '/');
        return `http://127.0.0.1:5000${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
                <Link
                    href="/admin/products/add"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Ürün Ekle
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fiyat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stok
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Yükleyen
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDesigns.map((design: any) => (
                                <tr key={design._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                    src={getImageUrl(design.images?.preview || design.images?.original)}
                                                    alt={design.title}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{design.title}</div>
                                                <div className="text-xs text-gray-500">ID: {design._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {design.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₺{design.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStockChange(design._id, design.stock, -1)}
                                                disabled={updatingStockId === design._id || design.stock === 0}
                                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900 w-12 text-center">
                                                {updatingStockId === design._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                ) : (
                                                    design.stock
                                                )}
                                            </span>
                                            <button
                                                onClick={() => handleStockChange(design._id, design.stock, 1)}
                                                disabled={updatingStockId === design._id}
                                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {design.uploadedBy?.firstName} {design.uploadedBy?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">{design.uploadedBy?.email}</div>
                                        {design.userRole === 'influencer' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                                Influencer
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/edit/${design._id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(design._id, design.title)}
                                                disabled={deleteDesignMutation.isPending}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDesigns.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>Bu kategoride ürün bulunmuyor.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
