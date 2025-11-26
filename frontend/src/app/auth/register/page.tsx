"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

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
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hesap Oluştur
          </h2>
          <p className="text-sm text-gray-500">
            Aramıza katılın
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName', { required: true })}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                    placeholder="Adınız"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('lastName', { required: true })}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                    placeholder="Soyadınız"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Türü</label>
              <select
                {...register('role')}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white"
              >
                <option value="customer">Müşteri (Alışveriş Yapacağım)</option>
                <option value="influencer">Influencer (Tasarım Satacağım)</option>
                <option value="admin">Admin (Sistem Yöneticisi)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kayıt Ol'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
