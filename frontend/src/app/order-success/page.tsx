"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Home, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-green-900/10 to-transparent opacity-50" />
            </div>

            <div className="glass-dark rounded-[2.5rem] shadow-2xl p-8 md:p-16 max-w-lg w-full text-center animate-in fade-in zoom-in duration-700 border border-white/10 relative z-10 backdrop-blur-xl">
                <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10 ring-1 ring-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <CheckCircle2 className="h-14 w-14 text-green-400" />
                </div>

                <h1 className="text-4xl font-black text-white mb-6 tracking-tight">
                    Siparişiniz Alındı!
                </h1>

                <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                    Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu ve hazırlanmaya başlandı.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/profile/orders"
                        className="block w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Package className="w-5 h-5" />
                        Siparişlerimi Gör
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-black/40 text-gray-300 border border-white/10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 hover:border-white/20"
                    >
                        <Home className="w-5 h-5" />
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
