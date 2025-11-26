"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { Loader2, Users, Search, Shield, Star, User as UserIcon, Trash2 } from 'lucide-react';

type RoleFilter = 'all' | 'customer' | 'influencer' | 'admin';

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<RoleFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const res = await api.get('/admin/users');
            return res.data;
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            alert('Kullanıcı başarıyla silindi.');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Silme işlemi başarısız.');
        }
    });

    const handleDelete = (id: string, name: string) => {
        if (confirm(`"${name}" kullanıcısını silmek istediğinize emin misiniz?`)) {
            deleteUserMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Kullanıcılar yüklenirken bir hata oluştu.
            </div>
        );
    }

    const filteredUsers = users?.filter((user: any) => {
        const matchesRole = activeTab === 'all' || user.role === activeTab;
        const matchesSearch = searchQuery === '' ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    }) || [];

    const tabs = [
        { id: 'all' as RoleFilter, label: 'Tümü', icon: Users, count: users?.length || 0 },
        { id: 'customer' as RoleFilter, label: 'Müşteriler', icon: UserIcon, count: users?.filter((u: any) => u.role === 'customer').length || 0 },
        { id: 'influencer' as RoleFilter, label: 'Influencerlar', icon: Star, count: users?.filter((u: any) => u.role === 'influencer').length || 0 },
        { id: 'admin' as RoleFilter, label: 'Adminler', icon: Shield, count: users?.filter((u: any) => u.role === 'admin').length || 0 },
    ];

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Admin</span>;
            case 'influencer':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Influencer</span>;
            case 'customer':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Müşteri</span>;
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{role}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="İsim, soyisim veya email ile ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user: any) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-gray-500">ID: {user._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{user.email}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {user.verified ? 'Doğrulanmış' : 'Beklemede'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                                            disabled={deleteUserMutation.isPending}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>{searchQuery ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Bu kategoride kullanıcı bulunmuyor.'}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {activeTab === 'all' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0"><Users className="h-6 w-6 text-gray-400" /></div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kullanıcı</dt>
                                        <dd className="text-lg font-medium text-gray-900">{users?.length || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0"><UserIcon className="h-6 w-6 text-blue-400" /></div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Müşteriler</dt>
                                        <dd className="text-lg font-medium text-gray-900">{users?.filter((u: any) => u.role === 'customer').length || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0"><Star className="h-6 w-6 text-purple-400" /></div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Influencerlar</dt>
                                        <dd className="text-lg font-medium text-gray-900">{users?.filter((u: any) => u.role === 'influencer').length || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0"><Shield className="h-6 w-6 text-red-400" /></div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Adminler</dt>
                                        <dd className="text-lg font-medium text-gray-900">{users?.filter((u: any) => u.role === 'admin').length || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
