"use client";

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/axios';
import {
    CreditCard,
    MapPin,
    Truck,
    ShieldCheck,
    ChevronRight,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment

    // SMS Verification State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    // Form States
    const [address, setAddress] = useState({
        fullName: user ? `${user.firstName} ${user.lastName}` : '',
        phone: '',
        addressLine: '',
        city: '',
        zipCode: '',
        country: 'Türkiye'
    });

    const [payment, setPayment] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const subtotal = getTotalPrice();
    const shipping = subtotal > 500 ? 0 : 29.90;
    const total = subtotal + shipping;

    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items, router]);

    // Timer for OTP
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showOtpModal && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showOtpModal, timeLeft]);

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate initial processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setShowOtpModal(true);
        setTimeLeft(180);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otpCode];
        newOtp[index] = value;
        setOtpCode(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const verifyOtp = async () => {
        const code = otpCode.join('');
        if (code.length !== 6) return;

        setLoading(true);

        try {
            // Create Order
            await api.post('/orders', {
                shippingAddress: {
                    address: address.addressLine,
                    city: address.city,
                    postalCode: address.zipCode,
                    country: address.country,
                },
                paymentInfo: {
                    id: 'simulated_payment_id',
                    status: 'paid',
                    update_time: new Date().toISOString(),
                    email_address: user?.email || 'guest@example.com',
                },
            });

            setLoading(false);
            setShowOtpModal(false);
            clearCart();
            router.push('/order-success');
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'address' | 'payment') => {
        const { name, value } = e.target;
        if (section === 'address') {
            setAddress(prev => ({ ...prev, [name]: value }));
        } else {
            // Simple formatting for card inputs
            let formattedValue = value;
            if (name === 'cardNumber') {
                formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
            } else if (name === 'expiry') {
                formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
            } else if (name === 'cvc') {
                formattedValue = value.replace(/\D/g, '').slice(0, 3);
            }
            setPayment(prev => ({ ...prev, [name]: formattedValue }));
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 relative">
            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Doğrulama Kodu</h3>
                            <p className="text-gray-500 text-sm">
                                Lütfen <strong>{address.phone}</strong> numaralı telefonunuza gönderilen 6 haneli kodu giriniz.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 mb-8">
                            {otpCode.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <div className="text-center mb-8 text-sm font-medium text-gray-500">
                            Kalan Süre: <span className="text-indigo-600">{formatTime(timeLeft)}</span>
                        </div>

                        <button
                            onClick={verifyOtp}
                            disabled={loading || otpCode.some(d => !d)}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Doğrulanıyor...
                                </span>
                            ) : 'Onayla ve Bitir'}
                        </button>

                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium text-sm"
                        >
                            İptal Et
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Lock className="h-8 w-8 text-indigo-600" />
                        Güvenli Ödeme
                    </h1>
                    <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
                        <Link href="/cart" className="hover:text-indigo-600 transition-colors">Sepet</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className={step === 1 ? 'text-indigo-600' : ''}>Teslimat</span>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className={step === 2 ? 'text-indigo-600' : ''}>Ödeme</span>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7">
                        {step === 1 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                    Teslimat Adresi
                                </h2>
                                <form onSubmit={handleAddressSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={address.fullName}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                placeholder="05XX XXX XX XX"
                                                value={address.phone}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                            <input
                                                type="text"
                                                name="addressLine"
                                                required
                                                placeholder="Mahalle, Sokak, No, Daire..."
                                                value={address.addressLine}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={address.city}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                required
                                                value={address.zipCode}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 border border-transparent rounded-xl shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center transition-colors"
                                    >
                                        Ödeme Adımına Geç
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-indigo-600" />
                                        Kart Bilgileri
                                    </h2>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Adresi Düzenle
                                    </button>
                                </div>

                                <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">Teslimat Adresi:</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {address.fullName}<br />
                                        {address.addressLine}<br />
                                        {address.zipCode} {address.city} / {address.country}<br />
                                        {address.phone}
                                    </p>
                                </div>

                                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            required
                                            value={payment.cardName}
                                            onChange={(e) => handleInputChange(e, 'payment')}
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                required
                                                placeholder="0000 0000 0000 0000"
                                                value={payment.cardNumber}
                                                onChange={(e) => handleInputChange(e, 'payment')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 pl-10 border"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CreditCard className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                required
                                                placeholder="MM/YY"
                                                value={payment.expiry}
                                                onChange={(e) => handleInputChange(e, 'payment')}
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    required
                                                    placeholder="123"
                                                    value={payment.cvc}
                                                    onChange={(e) => handleInputChange(e, 'payment')}
                                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 pl-10 border"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl shadow-lg py-4 px-4 text-lg font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center transform transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                {total.toFixed(2)} TL Öde
                                                <CheckCircle2 className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                                        <ShieldCheck className="h-4 w-4 text-green-500" />
                                        <span>256-bit SSL ile güvenli ödeme</span>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h3>

                            <div className="flow-root">
                                <ul role="list" className="-my-4 divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={`${item.id}-${item.size}-${item.color}`} className="flex py-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-1 mr-2">{item.title}</h3>
                                                        <p className="ml-4">₺{item.price.toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.color} - {item.size}</p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-500">Adet: {item.quantity}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <dl className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Ara Toplam</dt>
                                    <dd className="text-sm font-medium text-gray-900">₺{subtotal.toFixed(2)}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Kargo</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {shipping === 0 ? <span className="text-green-600">Ücretsiz</span> : `₺${shipping.toFixed(2)}`}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <dt className="text-base font-bold text-gray-900">Toplam</dt>
                                    <dd className="text-xl font-bold text-indigo-600">₺{total.toFixed(2)}</dd>
                                </div>
                            </dl>

                            <div className="mt-6 bg-indigo-50 rounded-xl p-4 flex items-start gap-3">
                                <Truck className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-indigo-900">Ücretsiz Kargo</p>
                                    <p className="text-xs text-indigo-700 mt-0.5">500 TL üzeri alışverişlerde kargo bedava.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
