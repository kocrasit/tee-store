"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    Settings,
    Shirt,
    Palette,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

function ProfileAvatar({ user }: { user: any }) {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=6366f1&color=fff&bold=true`;

    return (
        <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
            <img
                src={avatarUrl}
                alt={name}
                className="relative w-10 h-10 rounded-full object-cover border-2 border-[#0F172A]"
            />
        </div>
    );
}

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    React.useEffect(() => {
        if (!user || user.role !== 'influencer') {
            router.replace('/');
        }
    }, [user, router]);

    if (!user || user.role !== 'influencer') return null;

    const navigation = [
        { name: 'Genel Bakış', href: '/influencer/dashboard', icon: LayoutDashboard },
        { name: 'Tasarım Oluştur', href: '/influencer/design/create', icon: Palette },
        { name: 'Tasarım Ekle', href: '/influencer/design/add', icon: PlusCircle },
        { name: 'Koleksiyonum', href: '/influencer/designs', icon: Shirt },
        { name: 'Ayarlar', href: '/influencer/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex font-sans text-slate-200">
            {/* Sidebar - Desktop */}
            <aside className="w-72 bg-[#020617]/60 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen">
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                            E
                        </div>
                        <div>
                            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Elite Panel
                            </span>
                            <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest">Creator Studio</p>
                        </div>
                    </div>
                </div>

                {/* Profile Widget */}
                <div className="px-5 py-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/8 backdrop-blur-sm group hover:border-indigo-500/30 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <ProfileAvatar user={user} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                    @{user.influencerProfile?.instagramUsername || 'influencer'}
                                </p>
                                <div className="mt-1.5 inline-flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                                    <span className="text-[10px] text-emerald-400 font-medium">Aktif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <p className="px-4 mb-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                        Menü
                    </p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {/* Left accent bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                )}
                                <item.icon
                                    className={`mr-3 h-4.5 w-4.5 transition-colors ${
                                        isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                                    }`}
                                />
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Çıkış Yap
                    </button>
                    <div className="mt-3 flex items-center justify-between px-2">
                        <span className="text-[10px] text-slate-700">v2.4.0</span>
                        <span className="text-[10px] text-slate-700">Elite Dashboard</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F172A]">
                {/* Mobile Header */}
                <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                            E
                        </div>
                        <span className="font-bold text-white">Elite Panel</span>
                    </div>
                    <ProfileAvatar user={user} />
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 md:pb-10">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/8 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all min-w-[56px] ${
                                    isActive
                                        ? 'text-indigo-400'
                                        : 'text-slate-600 hover:text-slate-400'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-500/15' : ''}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-semibold leading-none truncate max-w-[52px] text-center">
                                    {item.name.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all min-w-[56px] text-slate-600 hover:text-red-400"
                    >
                        <div className="p-1.5 rounded-lg">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-semibold">Çıkış</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
