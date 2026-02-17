"use client";

import React, { useState } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Package,
    Wallet,
    CheckCircle,
    ChevronRight,
    Bell,
    ShieldCheck,
    Shirt,
    Settings,
    Palette,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface DashboardStats {
    totalSales: number;
    totalEarnings: number;
    pendingPayout: number;
    paidAmount: number;
    orderCount: number;
    productsSold: number;
    activeProducts: number;
    totalProducts: number;
    availableBalance?: number;
    pendingBalance?: number;
    withdrawnBalance?: number;
    commissionRate: number;
    hasPaymentInfo?: boolean;
    paymentInfoStatus?: 'approved' | 'pending' | 'none';
}

interface MonthlyTrend {
    year: number;
    month: number;
    period: string;
    totalEarnings: number;
    // ... other fields
}

interface RecentOrder {
    _id: string;
    status: string;
    createdAt: string;
    itemCount: number;
    totalSales: number;
    earnings: number;
    items: {
        title: string;
        image: string;
        quantity: number;
        price: number;
        earnings: number;
    }[];
}

// Helpers
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('try-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(amount);
};

const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0F172A] border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-emerald-400 font-bold text-sm">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export default function InfluencerDashboard() {
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const { user } = useAuthStore();

    // Data Fetching
    const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
        queryKey: ['influencerDashboardStats'],
        queryFn: async () => {
            const res = await api.get('/influencer/dashboard/stats');
            console.log('[DASHBOARD] Stats response:', res.data); // Debug
            return res.data?.data || res.data; // Handle nested response
        }
    });

    const { data: monthlyTrend } = useQuery<MonthlyTrend[]>({
        queryKey: ['influencerMonthlyTrend'],
        queryFn: async () => {
            const res = await api.get('/influencer/dashboard/monthly-trend');
            return res.data?.data || res.data;
        }
    });

    const { data: recentOrders, isLoading: ordersLoading } = useQuery<RecentOrder[]>({
        queryKey: ['influencerRecentOrders'],
        queryFn: async () => {
            const res = await api.get('/influencer/dashboard/recent-orders?limit=10');
            return res.data?.data || res.data;
        }
    });

    // Chart Data Preparation
    const chartData = monthlyTrend?.map(m => ({
        name: monthNames[m.month - 1],
        value: m.totalEarnings
    })) || [];

    if (statsLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans">

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Genel Bakış</h1>
                    <p className="text-slate-400 mt-1">Finansal durumunu ve performansını buradan takip et.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <Link href="/influencer/payouts">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            Ödeme Talep Et
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section - Balance Showcase */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Main Balance Card */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 backdrop-blur-md p-8 group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-48 h-48 text-indigo-500 transform rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-indigo-300 mb-2">
                            <span className="text-sm font-semibold uppercase tracking-wider">Çekilebilir Bakiye</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                {formatCurrency(stats?.availableBalance || 0).replace('₺', '')}
                                <span className="text-3xl text-slate-400 ml-1">₺</span>
                            </h2>
                        </div>
                        <p className="text-slate-400 mt-4 max-w-md">
                            Onaylanmış ve hesabınıza aktarılmaya hazır tutar. Ödemeler her iş günü işleme alınır.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Bekleyen (Onay)</p>
                                <p className="text-lg font-bold text-amber-400">{formatCurrency(stats?.pendingBalance || 0)}</p>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Toplam Çekilen</p>
                                <p className="text-lg font-bold text-slate-300">{formatCurrency(stats?.withdrawnBalance || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Earnings Stat */}
                    <div className="rounded-2xl bg-[#1E293B]/50 border border-white/5 p-6 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">+12.5%</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Toplam Kazanç</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats?.totalEarnings || 0)}</p>
                    </div>

                    {/* Products Stat */}
                    <div className="rounded-2xl bg-[#1E293B]/50 border border-white/5 p-6 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                                <Package className="w-6 h-6" />
                            </div>
                            <span className="text-xs text-slate-500">Bu ay</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Satılan Ürünler</p>
                        <p className="text-2xl font-bold text-white mt-1">{stats?.productsSold || 0} <span className="text-sm font-normal text-slate-500">adet</span></p>
                    </div>
                </div>
            </motion.section>

            {/* Charts & Activation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Graph */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 rounded-2xl bg-[#1E293B]/30 border border-white/5 p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Gelir Analizi</h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500">
                            <option>Son 6 Ay</option>
                            <option>Son 12 Ay</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickFormatter={(value) => `₺${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorEarnings)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Quick Actions Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-indigo-500/20 p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-10 -mt-10" />

                    <div className="flex items-start gap-4 mb-6 relative z-10">
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Hızlı İşlemler</h3>
                            <p className="text-slate-400 text-xs mt-1">Koleksiyonunuzu yönetin.</p>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <Link href="/influencer/design/create">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                                    <Palette className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Yeni Tasarım Oluştur</p>
                                    <p className="text-xs text-slate-500">Studio Editor ile</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </Link>
                        <Link href="/influencer/designs">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-slate-600 hover:bg-white/8 transition-all cursor-pointer group mt-2">
                                <div className="p-2 rounded-lg bg-slate-700/50 text-slate-300">
                                    <Shirt className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Koleksiyonum</p>
                                    <p className="text-xs text-slate-500">{stats?.totalProducts || 0} tasarım</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                            </div>
                        </Link>
                        <Link href="/influencer/settings">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-slate-600 hover:bg-white/8 transition-all cursor-pointer group mt-2">
                                <div className="p-2 rounded-lg bg-slate-700/50 text-slate-300">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Hesap Ayarları</p>
                                    <p className="text-xs text-slate-500">Profil ve bildirimler</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-white/5 bg-[#1E293B]/20 backdrop-blur-sm overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">Son Siparişler & Aktiviteler</h3>

                    <div className="flex items-center bg-white/5 rounded-lg border border-white/5 p-1">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Siparişler
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Ürünler
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === 'orders' && (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="p-6 font-medium">Sipariş ID</th>
                                    <th className="p-6 font-medium">Ürün Detayı</th>
                                    <th className="p-6 font-medium text-center">Durum</th>
                                    <th className="p-6 font-medium text-right">Tutar</th>
                                    <th className="p-6 font-medium text-right">Kazancınız</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {recentOrders?.map((order) => (
                                    <tr key={order._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <span className="font-mono text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
                                            <p className="text-xs text-slate-600 mt-1">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                {order.items[0]?.image ? (
                                                    <img src={order.items[0].image} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-slate-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium truncate max-w-[150px]">{order.items[0]?.title || 'Ürün'}</p>
                                                    <p className="text-xs text-slate-500">{order.itemCount > 1 ? `+${order.itemCount - 1} diğer ürün` : '1 adet'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {order.status === 'delivered' ? 'Teslim Edildi' :
                                                    order.status === 'processing' ? 'İşleniyor' :
                                                        order.status === 'cancelled' ? 'İptal' : 'Beklemede'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right text-slate-300 font-medium">
                                            {formatCurrency(order.totalSales)}
                                        </td>
                                        <td className="p-6 text-right font-bold text-emerald-400">
                                            +{formatCurrency(order.earnings)}
                                        </td>
                                    </tr>
                                ))}
                                {!recentOrders?.length && !ordersLoading && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-500">
                                            Henüz sipariş bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'products' && (
                        <div className="p-12 text-center text-slate-500">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Ürün performans verileri hazırlanıyor...</p>
                        </div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}
