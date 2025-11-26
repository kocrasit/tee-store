"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';
import { User, Lock, Save, Loader2, Globe, CreditCard, Edit2, X } from 'lucide-react';

export default function InfluencerSettings() {
    const { user, setUser } = useAuthStore();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        influencerProfile: {
            bio: '',
            socialLinks: {
                twitter: '',
                instagram: '',
                tiktok: '',
            },
            bankAccount: '',
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user && !isEditingProfile) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                influencerProfile: {
                    bio: user.influencerProfile?.bio || '',
                    socialLinks: {
                        twitter: user.influencerProfile?.socialLinks?.twitter || '',
                        instagram: user.influencerProfile?.socialLinks?.instagram || '',
                        tiktok: user.influencerProfile?.socialLinks?.tiktok || '',
                    },
                    bankAccount: user.influencerProfile?.bankAccount || '',
                }
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
            influencerProfile: {
                bio: user?.influencerProfile?.bio || '',
                socialLinks: {
                    twitter: user?.influencerProfile?.socialLinks?.twitter || '',
                    instagram: user?.influencerProfile?.socialLinks?.instagram || '',
                    tiktok: user?.influencerProfile?.socialLinks?.tiktok || '',
                },
                bankAccount: user?.influencerProfile?.bankAccount || '',
            }
        });
    };

    const handleCancelPassword = () => {
        setIsEditingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>

            {/* Profile Information */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-600" />
                        Profil Bilgileri
                    </h3>
                    {!isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Düzenle
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {!isEditingProfile ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Ad</label>
                                    <div className="text-gray-900 font-medium">{user?.firstName}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Soyad</label>
                                    <div className="text-gray-900 font-medium">{user?.lastName}</div>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Telefon</label>
                                <div className="text-gray-900 font-medium">{user?.phoneNumber || 'Belirtilmemiş'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <label className="block text-xs font-medium text-gray-500 mb-1">E-posta</label>
                                <div className="text-gray-900 font-medium">{user?.email}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
                                <div className="text-gray-900">{user?.influencerProfile?.bio || 'Belirtilmemiş'}</div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    Sosyal Medya
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Twitter</label>
                                        <div className="text-gray-900 text-sm">{user?.influencerProfile?.socialLinks?.twitter || '-'}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
                                        <div className="text-gray-900 text-sm">{user?.influencerProfile?.socialLinks?.instagram || '-'}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">TikTok</label>
                                        <div className="text-gray-900 text-sm">{user?.influencerProfile?.socialLinks?.tiktok || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    Banka Bilgileri
                                </h4>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">IBAN</label>
                                    <div className="text-gray-900 font-mono text-sm">{user?.influencerProfile?.bankAccount || 'Belirtilmemiş'}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="+90 555 123 45 67"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={profileData.influencerProfile.bio}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        influencerProfile: { ...profileData.influencerProfile, bio: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Kendinizden bahsedin..."
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    Sosyal Medya
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                        <input
                                            type="text"
                                            value={profileData.influencerProfile.socialLinks.twitter}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                influencerProfile: {
                                                    ...profileData.influencerProfile,
                                                    socialLinks: { ...profileData.influencerProfile.socialLinks, twitter: e.target.value }
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="@kullaniciadi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                        <input
                                            type="text"
                                            value={profileData.influencerProfile.socialLinks.instagram}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                influencerProfile: {
                                                    ...profileData.influencerProfile,
                                                    socialLinks: { ...profileData.influencerProfile.socialLinks, instagram: e.target.value }
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="@kullaniciadi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                                        <input
                                            type="text"
                                            value={profileData.influencerProfile.socialLinks.tiktok}
                                            onChange={(e) => setProfileData({
                                                ...profileData,
                                                influencerProfile: {
                                                    ...profileData.influencerProfile,
                                                    socialLinks: { ...profileData.influencerProfile.socialLinks, tiktok: e.target.value }
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="@kullaniciadi"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    Banka Bilgileri
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                                    <input
                                        type="text"
                                        value={profileData.influencerProfile.bankAccount}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            influencerProfile: { ...profileData.influencerProfile, bankAccount: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Kazançlarınızın aktarılacağı hesap</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                >
                                    {updateProfileMutation.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    ) : (
                                        <Save className="w-3.5 h-3.5 mr-1.5" />
                                    )}
                                    Kaydet
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelProfile}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 mr-1.5" />
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        Şifre Değiştir
                    </h3>
                    {!isEditingPassword && (
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Değiştir
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {!isEditingPassword ? (
                        <p className="text-gray-500 text-sm">Şifrenizi değiştirmek için "Değiştir" butonuna tıklayın.</p>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={changePasswordMutation.isPending}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {changePasswordMutation.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    ) : (
                                        <Lock className="w-3.5 h-3.5 mr-1.5" />
                                    )}
                                    Şifreyi Değiştir
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelPassword}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 mr-1.5" />
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
