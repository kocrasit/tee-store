"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { Loader2, Eye, CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['adminOrders'],
        queryFn: async () => {
            const res = await api.get('/orders');
            return res.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await api.put(`/orders/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            setUpdatingId(null);
            alert('Sipariş durumu güncellendi.');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Güncelleme başarısız.');
            setUpdatingId(null);
        }
    });

    const handleStatusChange = (id: string, newStatus: string) => {
        if (confirm('Sipariş durumunu değiştirmek istediğinize emin misiniz?')) {
            setUpdatingId(id);
            updateStatusMutation.mutate({ id, status: newStatus });
        }
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
                Siparişler yüklenirken bir hata oluştu.
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Beklemede';
            case 'processing': return 'Hazırlanıyor';
            case 'shipped': return 'Kargolandı';
            case 'delivered': return 'Teslim Edildi';
            case 'cancelled': return 'İptal Edildi';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Toplam {orders?.length || 0} Sipariş
                </span>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sipariş ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutar
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders?.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-medium text-gray-900">
                                            {order.user?.firstName} {order.user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₺{order.finalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <select
                                                disabled={updatingId === order._id}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="block w-32 pl-3 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="pending">Beklemede</option>
                                                <option value="processing">Hazırlanıyor</option>
                                                <option value="shipped">Kargolandı</option>
                                                <option value="delivered">Teslim Edildi</option>
                                                <option value="cancelled">İptal Edildi</option>
                                            </select>
                                            {updatingId === order._id && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!orders || orders.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>Henüz hiç sipariş bulunmuyor.</p>
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
