'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, Ticket, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import React from 'react';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            router.replace('/auth/login');
        }
    }, [user, router]);

    // Don't render if not logged in
    if (!user) {
        return null;
    }

    const navigation = [
        { name: 'Profil Bilgileri', href: '/profile/customer', icon: User },
        { name: 'Siparişlerim', href: '/profile/orders', icon: ShoppingBag },
        { name: 'Kuponlarım', href: '/profile/coupons', icon: Ticket },
        { name: 'Bildirimler', href: '/profile/notifications', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 via-40% to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-72 flex-shrink-0">
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden sticky top-8">
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                                        <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-4 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                                                : 'text-gray-600 hover:bg-white hover:shadow-md hover:text-indigo-600'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/';
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300 group"
                                    >
                                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Çıkış Yap
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
