"use client";

import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export default function InfluencerDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['influencerStats'],
        queryFn: async () => {
            const res = await api.get('/influencer/dashboard');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const statItems = [
        { name: 'Toplam Kazanç', value: `₺${stats?.totalEarnings?.toFixed(2) || '0.00'}`, icon: DollarSign, change: 'Komisyon', changeType: 'positive' },
        { name: 'Toplam Satış', value: stats?.totalSales || 0, icon: ShoppingBag, change: 'Adet', changeType: 'positive' },
        { name: 'Aktif Tasarımlar', value: stats?.activeDesigns || 0, icon: TrendingUp, change: 'Yayında', changeType: 'positive' },
        { name: 'Toplam Tasarım', value: stats?.totalDesigns || 0, icon: Users, change: 'Yüklenen', changeType: 'positive' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Influencer Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statItems.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{item.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="text-gray-500">{item.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Son Aktiviteler</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
                    Henüz bir satış aktivitesi yok.
                </div>
            </div>
        </div>
    );
}
