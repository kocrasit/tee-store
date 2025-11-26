"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, LogOut, Settings, Shirt, Palette } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function InfluencerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    // Redirect if not influencer
    React.useEffect(() => {
        if (!user || user.role !== 'influencer') {
            router.replace('/');
        }
    }, [user, router]);

    // Don't render if not influencer
    if (!user || user.role !== 'influencer') {
        return null;
    }

    const navigation = [
        { name: 'Dashboard', href: '/influencer/dashboard', icon: LayoutDashboard },
        { name: 'Tasarım Oluştur', href: '/influencer/design/create', icon: Palette },
        { name: 'Tasarım Ekle', href: '/influencer/design/add', icon: PlusCircle },
        { name: 'Tasarımlarım', href: '/influencer/designs', icon: Shirt },
        { name: 'Ayarlar', href: '/influencer/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-purple-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-purple-800">
                    <h2 className="text-2xl font-bold">Influencer Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-purple-800 text-white'
                                    : 'text-purple-100 hover:bg-purple-800'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-purple-800">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/';
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-purple-100 hover:bg-purple-800 rounded-md"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
