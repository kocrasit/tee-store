"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { User, Lock, Save, Loader2, Edit2, X } from 'lucide-react';

export default function CustomerProfile() {
  const { user, setUser } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize profile data when user is available
  useEffect(() => {
    if (user && !isEditingProfile) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, isEditingProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const res = await api.put('/users/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      setIsEditingProfile(false);
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
      setIsEditingPassword(false);
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

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    });
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-black border border-gray-200 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            Profil Bilgileri
          </h3>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-all duration-200 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              Düzenle
            </button>
          )}
        </div>

        <div className="p-8">
          {!isEditingProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ad</label>
                  </div>
                  <div className="text-gray-900 font-semibold text-lg">{user?.firstName}</div>
                </div>
                <div className="p-5 bg-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Soyad</label>
                  </div>
                  <div className="text-gray-900 font-semibold text-lg">{user?.lastName}</div>
                </div>
              </div>
              <div className="p-5 bg-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telefon</label>
                </div>
                <div className="text-gray-900 font-semibold text-lg">{user?.phoneNumber || 'Belirtilmemiş'}</div>
              </div>
              <div className="p-5 bg-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-posta</label>
                </div>
                <div className="text-gray-900 font-semibold text-lg">{user?.email}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ad</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Soyad</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Telefon</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm font-medium"
                  placeholder="+90 555 123 45 67"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md shadow-black/10"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  className="inline-flex items-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-red-600 border border-gray-200 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            Şifre Değiştir
          </h3>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-all duration-200 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              Değiştir
            </button>
          )}
        </div>

        <div className="p-8">
          {!isEditingPassword ? (
            <div className="flex items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/50 transition-all duration-200 group cursor-pointer" onClick={() => setIsEditingPassword(true)}>
              <div className="text-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-200 group-hover:scale-110 transition-transform duration-200 text-gray-400 group-hover:text-red-500">
                  <Lock className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-500 group-hover:text-red-600 transition-colors">Şifrenizi değiştirmek için tıklayın</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md shadow-red-500/10"
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Şifreyi Güncelle
                </button>
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="inline-flex items-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
