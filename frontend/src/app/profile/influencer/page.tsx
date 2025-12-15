"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { Palette, DollarSign, TrendingUp, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function InfluencerProfile() {
    const user = useAuthStore((state) => state.user);
    const [designTitle, setDesignTitle] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['influencerStats'],
        queryFn: async () => {
            const res = await api.get('/influencer/dashboard');
            return res.data;
        }
    });

    const { data: designs, isLoading: designsLoading } = useQuery({
        queryKey: ['influencerDesigns'],
        queryFn: async () => {
            const res = await api.get('/influencer/designs');
            return res.data;
        }
    });

    const isLoading = statsLoading || designsLoading;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-xs font-bold text-gray-500 truncate uppercase tracking-wider">Toplam Kazanç</dt>
                                        <dd className="text-2xl font-bold text-gray-900 mt-1">₺{stats?.totalEarnings?.toFixed(2) || '0.00'}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                                    <Palette className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-xs font-bold text-gray-500 truncate uppercase tracking-wider">Toplam Tasarım</dt>
                                        <dd className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalDesigns || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-xs font-bold text-gray-500 truncate uppercase tracking-wider">Toplam Satış</dt>
                                        <dd className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalSales || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Tasarımlarım</h3>
                        <p className="mt-1 text-sm text-gray-500">Yüklediğin tasarımlar ve durumları.</p>
                    </div>
                    <a href="/influencer/design/add" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Yeni Tasarım
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Görsel
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Başlık
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Fiyat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Satış
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {designsLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-black mb-2" />
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {designs?.map((design: any) => (
                                        <tr key={design._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={design.images?.thumbnail || design.images?.preview || ''} alt="" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{design.title}</div>
                                                <div className="text-xs text-gray-500">{design.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">₺{design.price}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{design.sales || 0}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${design.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    design.status === 'draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {design.status === 'published' ? 'Yayında' : design.status === 'draft' ? 'Taslak' : 'Reddedildi'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!designs || designs.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                                    <ImageIcon className="h-10 w-10 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Henüz Tasarım Yüklemediniz</h3>
                                                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                                                    İlk tasarımınızı yükleyerek satış yapmaya başlayın.
                                                </p>
                                                <div className="mt-6">
                                                    <a href="/influencer/design/add" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-bold rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                                                        <Upload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                                        İlk Tasarımı Yükle
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

