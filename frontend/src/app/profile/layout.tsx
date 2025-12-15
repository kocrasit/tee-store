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
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-4 mb-1">
                                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-md">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h2 className="text-base font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</h2>
                                        <p className="text-xs text-gray-500 font-medium truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-3 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                                ? 'bg-black text-white shadow-lg shadow-black/10'
                                                : 'text-gray-600 hover:bg-gray-100/80 hover:text-black'
                                                }`}
                                        >
                                            <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <div className="pt-3 mt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/';
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
