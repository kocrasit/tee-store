'use client';

import { useState } from 'react';
import api from '@/api/axios';
import { Send, Bell, User } from 'lucide-react';

export default function AdminNotificationsPage() {
    const [formData, setFormData] = useState({
        userId: '',
        title: '',
        message: '',
        type: 'info'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notifications', formData);
            alert('Bildirim başarıyla gönderildi!');
            setFormData({
                userId: '',
                title: '',
                message: '',
                type: 'info'
            });
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Bildirim gönderilirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Bell className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Bildirim Gönder</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kullanıcı ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.userId}
                                onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Bildirim gönderilecek kullanıcının ID'si"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Başlık
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Bildirim başlığı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mesaj
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Bildirim içeriği..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bildirim Tipi
                        </label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="info">Bilgilendirme</option>
                            <option value="order">Sipariş</option>
                            <option value="coupon">Kupon/Kampanya</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            'Gönderiliyor...'
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Bildirimi Gönder
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
