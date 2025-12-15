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
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Glassmorphic Card - Dark */}
        <div className="glass-dark p-10 rounded-3xl shadow-2xl animate-fade-in-up border border-white/10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 border border-white/20 shadow-lg backdrop-blur-sm">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
              HESAP OLUŞTUR
            </h2>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
              Aramıza katılın ve özel tasarımları keşfedin
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-scale-in">
              <p className="text-sm text-red-200 font-medium">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Ad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <input
                      {...register('firstName', { required: true })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                      placeholder="Adınız"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Soyad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <input
                      {...register('lastName', { required: true })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">E-posta</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Şifre</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
                  </div>
                  <input
                    {...register('password', { required: true })}
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white placeholder-gray-600 outline-none transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Hesap Türü</label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-white focus:bg-white/10 text-white outline-none transition-all duration-300 font-medium"
                >
                  <option value="customer" className="bg-black text-white">🛍️ Müşteri (Alışveriş Yapacağım)</option>
                  <option value="influencer" className="bg-black text-white">✨ Influencer (Tasarım Satacağım)</option>
                  <option value="admin" className="bg-black text-white">👑 Admin (Sistem Yöneticisi)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed group mt-6 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-black" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Kayıt Ol
                  <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="font-bold text-white hover:underline transition-all">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="text-center text-white/20 text-xs tracking-widest uppercase">
          <p>© 2025 TeeStore. Güvenli kayıt.</p>
        </div>
      </div>
    </div>
  );
}
