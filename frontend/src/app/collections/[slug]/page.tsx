'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

interface Design {
    _id: string;
    title: string;
    price: number;
    images?: { preview?: string };
    category?: string;
    rating?: number;
    reviews?: any[];
    userRole?: string;
    uploadedBy?: any;
}

interface HomepageSection {
    key: string;
    title: string;
    subtitle: string;
    bgColor: string;
    accentColor: string;
    products: Design[];
}

export default function CollectionPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: section, isLoading, error } = useQuery<HomepageSection>({
        queryKey: ['homepageSection', slug],
        queryFn: async () => {
            const res = await api.get(`/homepage/sections/${slug}`);
            return res.data as HomepageSection;
        },
        enabled: !!slug,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !section) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900">Koleksiyon bulunamadı</h1>
                <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="py-20 px-4" style={{ backgroundColor: section.bgColor }}>
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 opacity-70 hover:opacity-100 transition-opacity"
                        style={{ color: section.accentColor }}>
                        <ArrowLeft className="w-4 h-4" /> Ana Sayfa
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-2" style={{ color: section.accentColor }}>
                        {section.title}
                    </h1>
                    <p className="text-lg font-bold uppercase tracking-widest opacity-70" style={{ color: section.accentColor }}>
                        {section.subtitle}
                    </p>
                    {section.products.length > 0 && (
                        <p className="mt-3 text-sm opacity-60" style={{ color: section.accentColor }}>
                            {section.products.length} ürün
                        </p>
                    )}
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {section.products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                        {section.products.map((design) => (
                            <ProductCard
                                key={design._id}
                                id={design._id}
                                title={design.title}
                                price={design.price}
                                image={design.images?.preview || ''}
                                category={design.category || ''}
                                rating={typeof design.rating === 'number' ? design.rating : 0}
                                reviewsCount={Array.isArray(design.reviews) ? design.reviews.length : 0}
                                userRole={design.userRole as 'influencer' | 'designer' | undefined}
                                uploadedBy={design.uploadedBy}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Henüz ürün eklenmemiş</h2>
                        <p className="text-gray-500 mb-6">Bu koleksiyon yakında doldurulacak.</p>
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                            Tüm Ürünleri Gör
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
