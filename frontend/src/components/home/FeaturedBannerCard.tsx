"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export interface FeaturedBanner {
    _id: string;
    title: string;
    description?: string;
    image: string;
    link?: string;
    order?: number;
}

interface FeaturedBannerCardProps {
    banner: FeaturedBanner;
}

export default function FeaturedBannerCard({ banner }: FeaturedBannerCardProps) {
    const imageSrc = getImageUrl(banner.image);
    const content = (
        <div className="relative h-full min-h-[360px] sm:min-h-[480px] rounded-[2rem] overflow-hidden border border-white/10 bg-black group">
            <img
                src={imageSrc}
                alt={banner.title}
                onError={(event) => {
                    event.currentTarget.src = "/placeholder.jpg";
                }}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
                    {banner.order !== undefined ? `#${banner.order.toString().padStart(2, "0")}` : "KAMPANYA"}
                </p>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4 leading-tight">
                    {banner.title}
                </h3>
                {banner.description && (
                    <p className="text-sm text-white/80 mb-6 line-clamp-2">
                        {banner.description}
                    </p>
                )}
                <button className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-white transition-colors w-full sm:w-auto">
                    İncele
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    if (banner.link) {
        const isExternal = /^https?:\/\//i.test(banner.link);
        if (isExternal) {
            return (
                <a href={banner.link} target="_blank" rel="noreferrer" className="block h-full">
                    {content}
                </a>
            );
        }

        return (
            <Link href={banner.link} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
}

