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
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Handle scroll for glassmorphic effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/90 backdrop-blur-md border-b border-gray-100'
      : 'bg-white border-b border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-black group-hover:opacity-70 transition-opacity">
                ELEGANSIA
              </span>
            </Link>
          </div>

          {/* Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex items-center flex-1 px-12">
            <div className="w-full max-w-md relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 border-none bg-gray-100 rounded-xl leading-5 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black sm:text-sm transition-all duration-300 font-medium"
                placeholder="Ara..."
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {user && (
              <Link href="/cart" className="relative group p-2">
                <ShoppingCart className="h-6 w-6 text-gray-900 group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 group-hover:border-black transition-colors">
                    <User className="h-5 w-5 text-gray-900" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-t-2xl">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Hoşgeldin</p>
                    <p className="text-sm font-bold gradient-text truncate mt-0.5">{user.firstName} {user.lastName}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href={user.role === 'influencer' ? '/profile/influencer' : '/profile/customer'}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all group/item"
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-primary-500 transition-colors" />
                      Profilim
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all group/item"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-primary-500 transition-colors" />
                        Admin Dashboard
                      </Link>
                    )}

                    {user.role === 'influencer' && (
                      <Link
                        href="/influencer/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-all group/item"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-accent-500 transition-colors" />
                        Influencer Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-white/20 pt-2 pb-1">
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                      }}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all group/item"
                    >
                      <LogOut className="w-4 h-4 mr-3 group-hover/item:scale-110 transition-transform" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6 text-sm font-semibold">
                <Link href="/auth/login" className="text-gray-900 hover:text-gray-600 transition-colors">Giriş</Link>
                <Link href="/auth/register" className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg shadow-gray-200">Kayıt Ol</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

