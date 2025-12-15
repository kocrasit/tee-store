import React from 'react';
import Link from 'next/link';

export function BannerGrid() {
    const banners = [
        {
            id: 1,
            title: "YENİ SEZON",
            subtitle: "Keşfet & Tasarla",
            bgClass: "bg-[#28282B]",
            accentClass: "text-[#D4AF37]",
            link: "/products/new-season"
        },
        {
            id: 2,
            title: "ÇOK SATANLAR",
            subtitle: "Haftanın Favorileri",
            bgClass: "bg-[#172554]",
            accentClass: "text-white",
            link: "/products/best-sellers"
        },
        {
            id: 3,
            title: "İNDİRİM",
            subtitle: "%50'ye Varan Fırsatlar",
            bgClass: "bg-[#D4AF37]",
            accentClass: "text-black",
            link: "/products/sale"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <Link
                        key={banner.id}
                        href={banner.link}
                        className={`relative overflow-hidden rounded-xl p-6 h-32 flex flex-col justify-center ${banner.bgClass} transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg group`}
                    >
                        <div className="relative z-10">
                            <h3 className={`text-xl font-black italic tracking-tighter ${banner.accentClass} group-hover:scale-105 transition-transform origin-left`}>
                                {banner.title}
                            </h3>
                            <p className={`text-xs font-bold uppercase tracking-widest opacity-80 mt-1 ${banner.id === 3 ? 'text-black' : 'text-gray-300'}`}>
                                {banner.subtitle}
                            </p>
                        </div>

                        {/* Decoratiive shine effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
