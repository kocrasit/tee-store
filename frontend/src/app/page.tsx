"use client";

import React from 'react';
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";

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
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-indigo-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Kendi Tarzını</span>{' '}
                  <span className="block text-indigo-400 xl:inline">Üzerinde Taşı</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Binlerce bağımsız sanatçı ve influencer&apos;ın tasarladığı eşsiz T-Shirt koleksiyonlarını keşfet. Kaliteli kumaş, harika baskı.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Alışverişe Başla
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Tasarımcı Ol
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="T-shirts hanging"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Popüler Tasarımlar</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('influencer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'influencer'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Influencer Tasarımları
            </button>
            <button
              onClick={() => setFilter('company')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'company'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Şirket Tasarımları
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 TeeStore E-Commerce Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
