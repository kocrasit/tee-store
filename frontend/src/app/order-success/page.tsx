"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Home, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Siparişiniz Alındı!
                </h1>

                <p className="text-gray-500 text-lg mb-8">
                    Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu ve hazırlanmaya başlandı.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/profile/orders"
                        className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                    >
                        <Package className="w-5 h-5" />
                        Siparişlerimi Gör
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
