"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, Ticket, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<any[]>([]);
  const [backendDiscount, setBackendDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 29.90;

  // Fetch backend cart and coupons on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchBackendCart();
      fetchAvailableCoupons();
    }
  }, [user]);

  const fetchBackendCart = async () => {
    try {
      const { data } = await api.get('/cart');
      if (data) {
        // We might want to populate coupons to get details like code and amount
        // But for now let's assume we get IDs or populated objects if backend supports it.
        // The backend getCart just returns cart. We might need to populate in backend or fetch coupons details here.
        // Let's assume we need to fetch coupon details if they are just IDs.
        // Or better, update backend getCart to populate.
        // For now, let's just rely on what we have. If appliedCoupons is array of IDs, we can't show codes easily without fetching.
        // I'll assume for this implementation that we might need to improve backend getCart later, 
        // but for now I will try to fetch coupon details if I have IDs.

        // Actually, let's just use the totalDiscount from backend if available.
        setBackendDiscount(data.totalDiscount || 0);
        setAppliedCoupons(data.appliedCoupons || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setAvailableCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    try {
      await api.post('/coupons/apply', { code: couponCode });
      setCouponCode('');
      await fetchBackendCart(); // Refresh cart to get new discount
      alert('Kupon başarıyla uygulandı!');
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      alert(error.response?.data?.message || 'Kupon uygulanamadı.');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Henüz sepetinize hiç ürün eklemediniz. En yeni tasarımlarımızı keşfetmeye ne dersiniz?</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform transition hover:-translate-y-0.5">
              Alışverişe Başla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-indigo-600" />
          Alışveriş Sepeti
          <span className="text-sm font-medium text-gray-500 ml-2 mt-1">({items.length} Ürün)</span>
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-7">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-indigo-200 transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 truncate pr-4">
                          <Link href={`/design/${item.id}`} className="hover:text-indigo-600 transition-colors">
                            {item.title}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            {item.size}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            {item.color}
                          </span>
                        </div>
                      </div>
                      <p className="text-base font-bold text-indigo-600">₺{item.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-8 text-center bg-transparent border-none focus:ring-0 p-0 text-xs font-semibold text-gray-900"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
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
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              <dl className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <dt className="text-sm text-gray-600">Ara Toplam</dt>
                  <dd className="text-sm font-semibold text-gray-900">₺{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Kargo</span>
                  </dt>
                  <dd className="text-sm font-medium">
                    {shipping === 0 ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">Ücretsiz</span> : `₺${shipping.toFixed(2)}`}
                  </dd>
                </div>

                {/* Coupons Section */}
                <div className="py-3">
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ticket className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="İndirim Kodu"
                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading || !couponCode}
                      className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {loading ? '...' : 'Uygula'}
                    </button>
                  </div>

                  {/* Applied Coupons List */}
                  {appliedCoupons.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {appliedCoupons.map((coupon: any, idx) => (
                        <div key={coupon._id || idx} className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-3 py-2 rounded-lg border border-green-100 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded-full shadow-sm">
                              <Ticket className="w-3 h-3 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs tracking-wide">{coupon.code}</span>
                              <span className="text-[10px] text-green-600 font-medium">
                                {coupon.discountType === 'percentage' ? `%${coupon.discountValue} İndirim` : `₺${coupon.discountValue} İndirim`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCoupon(coupon._id)}
                            className="text-green-600 hover:text-red-600 p-1 hover:bg-white rounded-full transition-all"
                            title="Kuponu Kaldır"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Coupons List */}
                  {user && availableCoupons.length > 0 && (
                    <div className="mb-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <p className="text-[10px] font-bold text-indigo-900 mb-2 flex items-center gap-1 uppercase tracking-wider">
                        <Ticket className="w-3 h-3" />
                        Sizin İçin Fırsatlar
                      </p>
                      <div className="space-y-1.5">
                        {availableCoupons.map(c => (
                          <div key={c._id} className="flex items-center justify-between bg-white p-2 rounded border border-indigo-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCouponCode(c.code)}>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-indigo-700">{c.code}</span>
                              <span className="text-[10px] text-gray-500 mt-0.5">
                                {c.discountType === 'percentage' ? `%${c.discountValue} İndirim` : `₺${c.discountValue} İndirim`}
                              </span>
                            </div>
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                              Kullan
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {backendDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                      <dt className="text-sm">Toplam İndirim</dt>
                      <dd className="text-sm">-₺{backendDiscount.toFixed(2)}</dd>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                  <dt className="text-base font-bold text-gray-900">Toplam Tutar</dt>
                  <dd className="text-xl font-extrabold text-indigo-600">₺{total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl shadow-md py-3 px-4 text-base font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center transform transition hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Ödemeyi Tamamla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link href="/" className="text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors">
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
