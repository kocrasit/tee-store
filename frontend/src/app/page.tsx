"use client";

import React from 'react';
import ProductCard from "@/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import dynamic from 'next/dynamic';

const LoginHero3D = dynamic(() => import('@/components/ui/LoginHero3D'), { ssr: false });

// Dummy Data
const dummyProducts = [
  {
    id: '1',
    title: 'Neon Cyberpunk Tee',
    price: 250.00,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'İnfluencer Tasarımları',
    rating: 4.5,
    reviewsCount: 120
  },
  {
    id: '2',
    title: 'Minimalist Mountain',
    price: 180.50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Best Sellers',
    rating: 4.8,
    reviewsCount: 85
  },
  {
    id: '3',
    title: 'Retro Wave 80s',
    price: 210.00,
    image: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'New Arrivals',
    rating: 5.0,
    reviewsCount: 42
  },
  {
    id: '4',
    title: 'Abstract Art Face',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Şirket Tasarımları',
    rating: 4.2,
    reviewsCount: 210
  }
];

function HomeContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('keyword') || '';
  const [filter, setFilter] = React.useState<'all' | 'influencer' | 'company'>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ["designs", keyword],
    queryFn: async () => {
      const res = await api.get(`/designs?keyword=${keyword}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">Ürünler yüklenirken bir hata oluştu.</p>
      </main>
    );
  }

  const designs = data?.designs || [];

  // Filter designs based on selected filter
  const filteredDesigns = designs.filter((design: any) => {
    if (filter === 'all') return true;
    if (filter === 'influencer') return design.userRole === 'influencer';
    if (filter === 'company') return design.userRole !== 'influencer';
    return true;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <LoginHero3D />
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Popüler Tasarımlar</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${filter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
                }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('influencer')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${filter === 'influencer'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
                }`}
            >
              Influencer
            </button>
            <button
              onClick={() => setFilter('company')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${filter === 'company'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
                }`}
            >
              Şirket
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredDesigns.map((design: any) => (
            <ProductCard
              key={design._id}
              id={design._id}
              title={design.title}
              price={design.price}
              image={design.images?.preview}
              category={design.category}
              rating={typeof design.rating === "number" ? design.rating : 0}
              reviewsCount={Array.isArray(design.reviews) ? design.reviews.length : 0}
              userRole={design.userRole}
              uploadedBy={design.uploadedBy}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
