"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Stats Overview */}
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <DollarSign className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kazanç</dt>
                                            <dd className="text-lg font-medium text-gray-900">₺{stats?.totalEarnings?.toFixed(2) || '0.00'}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Palette className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Toplam Tasarım</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.totalDesigns || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <TrendingUp className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Toplam Satış Adedi</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats?.totalSales || 0}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Tasarımlarım</h3>
                            <p className="mt-1 text-sm text-gray-500">Yüklediğin tasarımlar ve durumları.</p>
                        </div>
                        <a href="/influencer/design/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Upload className="mr-2 h-5 w-5" />
                            Yeni Tasarım Yükle
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Görsel
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Başlık
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fiyat
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Satış
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {designsLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                                            Yükleniyor...
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {designs?.map((design: any) => (
                                            <tr key={design._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={design.images.thumbnail || design.images.original} alt="" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{design.title}</div>
                                                    <div className="text-sm text-gray-500">{design.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">₺{design.price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{design.sales}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${design.status === 'published' ? 'bg-green-100 text-green-800' :
                                                        design.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {design.status === 'published' ? 'Yayında' : design.status === 'draft' ? 'Taslak' : 'Reddedildi'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!designs || designs.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                                        <ImageIcon className="h-12 w-12 text-indigo-600" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900">Henüz Tasarım Yüklemediniz</h3>
                                                    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                                                        İlk tasarımınızı yükleyerek satış yapmaya başlayın. Tasarımlarınız onaylandıktan sonra mağazada listelenecektir.
                                                    </p>
                                                    <div className="mt-6">
                                                        <a href="/influencer/design/add" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
        </div>
    );
}

