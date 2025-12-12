'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Mail, User, Sparkles, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', data);
      login(res.data);
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
      toast.error('Kayıt başarısız.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Glassmorphic Card */}
        <div className="glass-card p-10 rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl mb-4 shadow-glow">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold gradient-text mb-2">
              Hesap Oluştur
            </h2>
            <p className="text-sm text-gray-600">
              Aramıza katılın ve özel tasarımları keşfedin
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-scale-in">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      {...register('firstName', { required: true })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                      placeholder="Adınız"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Soyad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      {...register('lastName', { required: true })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    {...register('password', { required: true })}
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hesap Türü</label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all duration-300 text-gray-700 font-medium"
                >
                  <option value="customer">🛍️ Müşteri (Alışveriş Yapacağım)</option>
                  <option value="influencer">✨ Influencer (Tasarım Satacağım)</option>
                  <option value="admin">👑 Admin (Sistem Yöneticisi)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Kayıt Ol
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="font-bold gradient-text hover:opacity-80 transition-opacity">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="text-center text-white/60 text-xs">
          <p>© 2025 TeeStore. Güvenli kayıt.</p>
        </div>
      </div>
    </div>
  );
}
