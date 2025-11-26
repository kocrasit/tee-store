"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      login(res.data); // Store user data in Zustand

      // Role based redirection
      if (res.data.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (res.data.role === 'influencer') {
        router.push('/profile/influencer');
      } else {
        router.push('/profile/customer');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hoş Geldiniz
          </h2>
          <p className="text-sm text-gray-500">
            Hesabınıza giriş yapın
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', { required: true })}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Şifremi unuttum
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Giriş Yap'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Hemen kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

