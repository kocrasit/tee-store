'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Ticket, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<any[]>([]);
  const [backendDiscount, setBackendDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  const shipping = subtotal > 500 ? 0 : 29.90;

  useEffect(() => {
    setSubtotal(getTotalPrice());
  }, [items, getTotalPrice]);

  const fetchBackendCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setAppliedCoupons(data.appliedCoupons || []);
      setBackendDiscount(data.discountAmount || 0);
    } catch (error) {
      console.error('Error fetching backend cart:', error);
    }
  };

  useEffect(() => {
    fetchBackendCart();
    if (user) {
      api.get('/coupons/available')
        .then(res => setAvailableCoupons(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    try {
      await api.post('/coupons/apply', { code: couponCode });
      setCouponCode('');
      await fetchBackendCart(); // Refresh cart to get new discount
      toast.success('Kupon başarıyla uygulandı!');
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Kupon uygulanamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async (id: string) => {
    try {
      await api.delete(`/coupons/remove/${id}`);
      await fetchBackendCart();
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  const total = Math.max(0, subtotal + shipping - backendDiscount);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
          <div className="glass-dark rounded-3xl shadow-2xl p-12 border border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <ShoppingBag className="h-10 w-10 text-white/80" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Sepetiniz Boş</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Henüz sepetinize hiç ürün eklemediniz. Özel koleksiyonumuzu keşfetmeye ne dersiniz?</p>
            <Link href="/" className="inline-flex items-center px-8 py-3.5 border border-white/20 text-sm font-bold rounded-xl shadow-lg shadow-white/5 text-black bg-white hover:bg-gray-200 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-white/10">
              Alışverişe Başla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24 pt-12 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-900/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl ring-1 ring-white/20">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          Alışveriş Sepeti
          <span className="text-sm font-medium text-gray-400 ml-2 mt-1 px-3 py-1 bg-white/5 rounded-full border border-white/10">{items.length} Ürün</span>
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-7">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="group glass-dark rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 flex items-center gap-5">
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-white/5 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white truncate pr-4">
                          <Link href={`/design/${item.id}`} className="hover:text-gray-300 transition-colors">
                            {item.title}
                          </Link>
                        </h3>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10 uppercase tracking-wider">
                            {item.size}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10 uppercase tracking-wider">
                            {item.color}
                          </span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-white">₺{item.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-10 text-center bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-white"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-xs text-gray-500 hover:text-red-400 font-bold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-900/10 border border-transparent hover:border-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Kaldır</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="lg:col-span-5 mt-16 lg:mt-0">
            <div className="glass-dark rounded-3xl p-8 border border-white/10 sticky top-24 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-gray-400" />
                Sipariş Özeti
              </h2>

              <dl className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <dt className="text-sm text-gray-400 font-medium">Ara Toplam</dt>
                  <dd className="text-sm font-bold text-white">₺{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <dt className="flex items-center text-sm text-gray-400 font-medium">
                    <span>Kargo</span>
                  </dt>
                  <dd className="text-sm font-medium">
                    {shipping === 0 ? <span className="text-green-400 bg-green-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-green-500/20">Ücretsiz</span> : <span className="text-white">₺{shipping.toFixed(2)}</span>}
                  </dd>
                </div>

                {/* Coupons Section */}
                <div className="py-2">
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ticket className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="İNDİRİM KODU"
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl text-xs font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent bg-black/40 text-white uppercase tracking-wider transition-all"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading || !couponCode}
                      className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all shadow-lg shadow-white/5 hover:scale-105 active:scale-95"
                    >
                      {loading ? '...' : 'UYGULA'}
                    </button>
                  </div>

                  {/* Applied Coupons List */}
                  {appliedCoupons.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {appliedCoupons.map((coupon: any, idx) => (
                        <div key={coupon._id || idx} className="flex justify-between items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 px-4 py-3 rounded-xl border border-green-500/20 shadow-sm relative overflow-hidden group">
                          {/* Shine effect */}
                          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                          <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-green-500/20 p-1.5 rounded-full">
                              <Ticket className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs tracking-wider text-white">{coupon.code}</span>
                              <span className="text-[10px] text-green-400 font-bold uppercase">
                                {coupon.discountType === 'percentage' ? `%${coupon.discountValue} İndirim` : `₺${coupon.discountValue} İndirim`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCoupon(coupon._id)}
                            className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-full transition-all relative z-10"
                            title="Kuponu Kaldır"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Coupons List */}
                  {user && availableCoupons.length > 0 && (
                    <div className="mb-4 bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-[10px] font-bold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                        <Ticket className="w-3 h-3" />
                        Sizin İçin Fırsatlar
                      </p>
                      <div className="space-y-2">
                        {availableCoupons.map(c => (
                          <div key={c._id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer group" onClick={() => setCouponCode(c.code)}>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-white group-hover:text-gray-300 transition-colors">{c.code}</span>
                              <span className="text-[10px] text-gray-500 mt-0.5">
                                {c.discountType === 'percentage' ? `%${c.discountValue} İndirim` : `₺${c.discountValue} İndirim`}
                              </span>
                            </div>
                            <span className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold hover:scale-105 transition-transform">
                              KULLAN
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {backendDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-400 font-bold bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20 mb-2">
                      <dt className="text-sm">Toplam İndirim</dt>
                      <dd className="text-sm">-₺{backendDiscount.toFixed(2)}</dd>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
                  <dt className="text-lg font-bold text-white">Toplam Tutar</dt>
                  <dd className="text-2xl font-bold text-white">₺{total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <Link
                  href="/checkout"
                  className="w-full bg-white text-black border border-transparent rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] py-4 px-4 text-base font-bold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white flex items-center justify-center transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ödemeyi Tamamla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link href="/" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider">
                  veya alışverişe devam et
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
