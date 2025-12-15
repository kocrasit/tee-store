"use client";

import Link from "next/link";

export default function MobileHero() {
    return (
        <div className="md:hidden block w-full rounded-b-[32px] overflow-hidden bg-gradient-to-b from-black via-black to-[#111] shadow-2xl border-b border-gray-900">
            <div
                className="h-[360px] relative flex flex-col justify-end px-6 py-10 text-white"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="relative z-10 space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">Yeni Koleksiyon</p>
                    <h1 className="text-3xl font-black leading-tight">
                        Mobilde de kusursuz modern tasarımlar
                    </h1>
                    <p className="text-sm text-white/80">
                        Influencer ve tasarımcıların hazırladığı sınırlı ürünleri hemen keşfet.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/products/new-season"
                            className="inline-flex items-center justify-center w-full rounded-full bg-white text-black text-sm font-bold uppercase tracking-widest py-3"
                        >
                            Koleksiyonu Keşfet
                        </Link>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center justify-center w-full rounded-full border border-white/30 text-white text-sm font-bold uppercase tracking-widest py-3"
                        >
                            Hesabına Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

