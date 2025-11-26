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
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl text-blue-900 shadow-sm ring-1 ring-gray-200">
              <User className="w-6 h-6" />
            </div>
            Profil Bilgileri
          </h3>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Düzenle
            </button>
          )}
        </div>

        <div className="p-8">
          {!isEditingProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Ad</label>
                  </div>
                  <div className="text-gray-900 font-bold text-xl pl-1">{user?.firstName}</div>
                </div>
                <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Soyad</label>
                  </div>
                  <div className="text-gray-900 font-bold text-xl pl-1">{user?.lastName}</div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Telefon</label>
                </div>
                <div className="text-gray-900 font-bold text-xl pl-1">{user?.phoneNumber || 'Belirtilmemiş'}</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">E-posta</label>
                </div>
                <div className="text-gray-900 font-bold text-xl pl-1">{user?.email}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Soyad</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="+90 555 123 45 67"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 font-bold text-sm tracking-wide"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  DEĞİŞİKLİKLERİ KAYDET
                </button>
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  className="inline-flex items-center px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-red-600 hover:shadow-md transition-all duration-200 font-bold text-sm tracking-wide"
                >
                  <X className="w-5 h-5 mr-2" />
                  İPTAL
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl text-red-600 shadow-sm ring-1 ring-gray-200">
              <Lock className="w-6 h-6" />
            </div>
            Şifre Değiştir
          </h3>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Değiştir
            </button>
          )}
        </div>

        <div className="p-8">
          {!isEditingPassword ? (
            <div className="flex items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all duration-300 group cursor-pointer" onClick={() => setIsEditingPassword(true)}>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm ring-1 ring-gray-100 group-hover:scale-110 transition-transform duration-300 text-red-500">
                  <Lock className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-600 group-hover:text-red-600 transition-colors">Şifrenizi değiştirmek için tıklayın</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 font-bold text-sm tracking-wide"
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  ŞİFREYİ GÜNCELLE
                </button>
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="inline-flex items-center px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-red-600 hover:shadow-md transition-all duration-200 font-bold text-sm tracking-wide"
                >
                  <X className="w-5 h-5 mr-2" />
                  İPTAL
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
