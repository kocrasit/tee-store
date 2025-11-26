'use client';

import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Siparişlerim</h1>
                <span className="text-sm text-blue-100">{orders.length} Sipariş</span>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl shadow-lg border border-gray-100">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Henüz siparişiniz yok</h3>
                    <p className="text-gray-500 mt-2">Alışverişe başlayın ve ilk siparişinizi verin.</p>
                    <Link href="/designs" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                        Alışverişe Başla
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            Sipariş Geçmişi
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-indigo-200 transition-all duration-300 hover:shadow-md bg-white">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sipariş No</div>
                                        <div className="font-mono font-bold text-gray-900 text-lg">#{order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam Tutar</div>
                                        <div className="font-bold text-indigo-600 text-lg">₺{order.finalAmount.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-gray-50 pt-4 mt-4">
                                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-200">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                <span className="absolute bottom-0 right-0 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-tl-lg">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
