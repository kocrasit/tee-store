"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, PlusCircle, LogOut, Settings, Tag, Bell, Megaphone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, router]);

  // Don't render if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Siparişler', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Ürün Yönetimi', href: '/admin/products', icon: ShoppingBag },
    { name: 'Ürün Ekle', href: '/admin/products/add', icon: PlusCircle },
    { name: 'Kuponlar', href: '/admin/coupons', icon: Tag },
    { name: 'Reklam Panoları', href: '/admin/banners', icon: Megaphone },
    { name: 'Bildirimler', href: '/admin/notifications', icon: Bell },
    { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h2 className="text-2xl font-bold">TeeStore Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-800'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-100 hover:bg-indigo-800 rounded-md"
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

