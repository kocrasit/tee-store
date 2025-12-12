'use client';

import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Ticket, Copy, Check, Clock } from 'lucide-react';

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minPurchaseAmount: number;
    expirationDate: string;
    assignedToUser?: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const { data } = await api.get('/coupons');
                setCoupons(data);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Kuponlarım</h1>
                <span className="text-sm text-blue-100">{coupons.length} Kupon</span>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ticket className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Aktif Kuponunuz Yok</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Kampanyaları takip ederek indirim fırsatlarını yakalayın. Yeni kuponlar hesabınıza tanımlandığında burada görebileceksiniz.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-purple-600" />
                            Kuponlarım
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {coupons.map((coupon) => (
                            <div key={coupon._id} className="border-2 border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-200 transition-all duration-300 hover:shadow-md bg-white">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                                    {coupon.discountType === 'percentage' ? `%${coupon.discountValue} İndirim` : `₺${coupon.discountValue} İndirim`}
                                </div>

                                {coupon.assignedToUser && (
                                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-br-2xl shadow-sm">
                                        Size Özel
                                    </div>
                                )}

                                <div className="mt-6">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-wider font-mono">{coupon.code}</h3>
                                        <button
                                            onClick={() => copyCode(coupon.code, coupon._id)}
                                            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                            title="Kodu Kopyala"
                                        >
                                            {copiedId === coupon._id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 mt-3">
                                        {coupon.minPurchaseAmount > 0 ? `${coupon.minPurchaseAmount} TL ve üzeri alışverişlerde geçerli.` : 'Alt limit yok.'}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Son Kullanma: {new Date(coupon.expirationDate).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>

                                {/* Decorative circles */}
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r-2 border-gray-200" />
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-l-2 border-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
