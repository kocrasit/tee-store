'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Key, ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        setResetUrl('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.resetUrl) {
                    setResetUrl(data.resetUrl);
                    setMessage('Şifre sıfırlama bağlantısı oluşturuldu.');
                    // Optional: Auto redirect after a delay, but show link first
                    setTimeout(() => {
                        window.location.href = data.resetUrl;
                    }, 1500);
                } else {
                    setMessage(data.message);
                    setEmail('');
                }
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="glass-dark p-8 rounded-3xl shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 border border-white/20 shadow-lg backdrop-blur-sm">
                            <Key className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Şifremi Unuttum</h1>
                        <p className="text-gray-400 text-sm">
                            Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl animate-fade-in-up">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <div>
                                    <p className="text-green-200 text-sm font-medium">{message}</p>
                                    {resetUrl && (
                                        <div className="mt-3">
                                            <p className="text-xs text-gray-400 mb-2">Otomatik yönlendiriliyorsunuz... Yönlenmezse:</p>
                                            <a href={resetUrl} className="text-xs bg-white text-black px-3 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors inline-block">
                                                manuel olarak git &rarr;
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl animate-fade-in-up">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-200 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Email Adresi
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                                    placeholder="ornek@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-black" />
                            ) : (
                                'Sıfırlama Linki Gönder'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-gray-400 hover:text-white text-sm font-medium transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Giriş sayfasına dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
