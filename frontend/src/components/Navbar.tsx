"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, LogOut, Menu, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

import { useCartStore } from '@/store/cartStore';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const setCart = useCartStore((state) => state.setCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  // Sync cart when user changes
  React.useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { default: api } = await import('@/api/axios');
          const res = await api.get('/cart');
          // Transform backend cart items to frontend format if needed
          // Backend: { design: {_id, ...}, quantity, size, color, title, price, image }
          // Frontend: { id, designId, title, price, image, size, color, quantity }

          const backendItems = res.data.items.map((item: any) => ({
            id: item.design._id || item.design, // Use design ID as item ID for now, or unique ID
            designId: item.design._id || item.design,
            title: item.title,
            price: item.price,
            image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }));
          setCart(backendItems);
        } catch (error) {
          console.error('Failed to fetch cart', error);
        }
      } else {
        // If no user, clear the cart (so next user doesn't see it)
        // We use set({ items: [] }) logic directly or a specific clearLocalCart method if we wanted to separate
        // But clearCart also tries to call backend. 
        // Let's manually clear local state here to avoid backend call loop if we used clearCart
        useCartStore.setState({ items: [] });
      }
    };

    fetchCart();
  }, [user, setCart]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword) {
        router.push(`/?keyword=${keyword}`);
      } else {
        // Optional: If empty, go back to home without query? 
        // Or do nothing if we want to keep current page if empty?
        // Let's go to root if on homepage, otherwise stay?
        // For simplicity: if empty and we were searching, clear it.
        if (window.location.search.includes('keyword')) {
          router.push('/');
        }
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, router]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Immediate search on Enter
      if (keyword.trim()) {
        router.push(`/?keyword=${keyword}`);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">TeeStore</span>
            </Link>
          </div>

          {/* Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex items-center flex-1 px-8">
            <div className="w-full max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Tasarım, renk veya kategori ara..."
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-6 w-6" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Hoşgeldin</p>
                    <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{user.firstName} {user.lastName}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href={user.role === 'influencer' ? '/profile/influencer' : '/profile/customer'}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      Profilim
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    {user.role === 'influencer' && (
                      <Link
                        href="/influencer/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                        Influencer Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-2 pb-1">
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                      }}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 text-sm font-medium">
                <Link href="/auth/login" className="text-gray-500 hover:text-gray-900">Giriş</Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Kayıt Ol</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
