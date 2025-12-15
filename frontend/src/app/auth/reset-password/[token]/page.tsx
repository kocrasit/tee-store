'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    useEffect(() => {
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`);
            const data = await res.json();

            if (res.ok) {
                setTokenValid(true);
                setUserEmail(data.email);
            } else {
                setError(data.message || 'Geçersiz veya süresi dolmuş token');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Token doğrulanıyor...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/10 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2">Geçersiz Bağlantı</h1>
                    <p className="text-gray-400 mb-8 font-medium">{error}</p>
                    <Link
                        href="/auth/forgot-password"
                        className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all w-full"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Yeni Link İste
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/10 text-center max-w-md w-full animate-fade-in-up">
                    <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2">Şifre Sıfırlandı!</h1>
                    <p className="text-gray-400 mb-6 font-medium">Şifreniz başarıyla güncellendi.</p>
                    <p className="text-sm text-gray-500 animate-pulse">Giriş sayfasına yönlendiriliyorsunuz...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 border border-white/20 shadow-lg backdrop-blur-sm">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Yeni Şifre Belirle</h1>
                        <p className="text-gray-400 text-sm">
                            {userEmail && <span className="font-bold text-white block mb-1">{userEmail}</span>}
                            için yeni şifre oluşturun
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl animate-scale-in">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-200 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Yeni Şifre
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                                    placeholder="En az 6 karakter"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Şifre Tekrar
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                                    placeholder="Şifrenizi tekrar girin"
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
                                'Şifreyi Kaydet'
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
