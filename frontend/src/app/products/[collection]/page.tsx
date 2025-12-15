'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import ProductCard from '@/components/product/ProductCard';
import { Loader2 } from 'lucide-react';

export default function CollectionPage() {
    const params = useParams();
    const collection = params.collection as string;

    // Map collection slug to query filter param
    const getFilterParam = (slug: string) => {
        switch (slug) {
            case 'new-season': return 'new';
            case 'best-sellers': return 'best';
            case 'sale': return 'sale';
            default: return '';
        }
    };

    const getCollectionTitle = (slug: string) => {
        switch (slug) {
            case 'new-season': return 'YENİ SEZON';
            case 'best-sellers': return 'ÇOK SATANLAR';
            case 'sale': return 'İNDİRİM';
            default: return 'KOLEKSİYON';
        }
    };

    const filter = getFilterParam(collection);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', 'collection', collection],
        queryFn: async () => {
            const endpoint = filter ? `/designs?filter=${filter}` : '/designs';
            const res = await api.get(endpoint);
            return res.data;
        },
        enabled: !!collection,
    });

    const products = Array.isArray(data?.designs) ? (data?.designs as any[]) : [];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-[#28282B] mb-4">
                        {getCollectionTitle(collection)}
                    </h1>
                    <div className="w-24 h-1 bg-gold rounded-full"></div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <>
                        {isError ? (
                            <div className="text-center py-20">
                                <p className="text-lg text-red-500">Koleksiyon yüklenirken bir sorun oluştu.</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-lg text-gray-500">Bu koleksiyonda henüz ürün bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4 xl:gap-x-8">
                                {products.map((design: any) => (
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
