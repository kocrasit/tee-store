"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from 'lucide-react';
import api from '@/api/axios';

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
    );
  }

  if (error) {
      return (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
              Veriler yüklenirken bir hata oluştu.
          </div>
      )
  }

  const stats = [
    { name: 'Toplam Gelir', value: `₺${data?.totalRevenue?.toLocaleString('tr-TR') || '0'}`, icon: DollarSign, change: '+12%', changeType: 'positive' },
    { name: 'Toplam Sipariş', value: data?.totalOrders || 0, icon: ShoppingBag, change: '+5%', changeType: 'positive' },
    { name: 'Aktif Kullanıcılar', value: data?.totalUsers || 0, icon: Users, change: '+18%', changeType: 'positive' },
    { name: 'Toplam Ürün', value: data?.totalProducts || 0, icon: TrendingUp, change: '-%', changeType: 'neutral' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
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
                <span className={`font-medium ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                </span>
                <span className="text-gray-500"> geçen aya göre</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Henüz bir aktivite yok.</p>
        </div>
      </div>
    </div>
  );
}

