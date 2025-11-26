'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

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
                    // For development convenience: redirect immediately
                    window.location.href = data.resetUrl;
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h1>
                    <p className="text-gray-600">
                        Email adresinizi girin, size şifre sıfırlama linki gönderelim
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">{message}</p>
                        <p className="text-green-700 text-xs mt-2">
                            Email kutunuzu kontrol edin. (Geliştirme modunda: Console'u kontrol edin)
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Adresi
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="ornek@email.com"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <Link
                        href="/auth/login"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium block"
                    >
                        ← Giriş sayfasına dön
                    </Link>
                    <Link
                        href="/auth/register"
                        className="text-gray-600 hover:text-gray-700 text-sm block"
                    >
                        Hesabınız yok mu? Kayıt olun
                    </Link>
                </div>
            </div>
        </div>
    );
}
