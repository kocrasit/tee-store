"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { User, Lock, Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
    const { user, setUser } = useAuthStore();

    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: typeof profileData) => {
            const res = await api.put('/users/profile', data);
            return res.data;
        },
        onSuccess: (data) => {
            setUser(data);
            alert('Profil başarıyla güncellendi!');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Profil güncellenemedi.');
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
            const res = await api.put('/users/password', data);
            return res.data;
        },
        onSuccess: () => {
            alert('Şifre başarıyla değiştirildi!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Şifre değiştirilemedi.');
        }
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileData);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('Yeni şifre en az 6 karakter olmalıdır!');
            return;
        }

        changePasswordMutation.mutate({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>

            {/* Profile Information */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    Profil Bilgileri
                </h3>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                            <input
                                type="text"
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                            <input
                                type="text"
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="+90 555 123 45 67"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                    </div>

                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Kaydet
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    Şifre Değiştir
                </h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {changePasswordMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Lock className="w-4 h-4 mr-2" />
                        )}
                        Şifreyi Değiştir
                    </button>
                </form>
            </div>
        </div>
    );
}
