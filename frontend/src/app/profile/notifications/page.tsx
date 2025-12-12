'use client';

import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Bell, Info, Tag, Package, Check } from 'lucide-react';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'order' | 'coupon';
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="w-5 h-5 text-blue-600" />;
            case 'coupon': return <Tag className="w-5 h-5 text-purple-600" />;
            default: return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'order': return 'bg-blue-50';
            case 'coupon': return 'bg-purple-50';
            default: return 'bg-gray-50';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Bildirimler</h1>
                <span className="text-sm text-blue-100">{notifications.length} Bildirim</span>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bildiriminiz Yok</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Şu an için size ulaşan yeni bir bildirim bulunmuyor. Önemli gelişmelerden sizi haberdar edeceğiz.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-indigo-600" />
                            Bildirimler
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-5 rounded-2xl border-2 transition-all duration-200 ${notification.isRead
                                    ? 'bg-white border-gray-100 hover:border-gray-200'
                                    : 'bg-indigo-50/50 border-indigo-100 shadow-sm hover:border-indigo-200'
                                    }`}
                            >
                                <div className="flex gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${getBgColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className={`font-bold text-lg ${notification.isRead ? 'text-gray-900' : 'text-indigo-900'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg">
                                                {new Date(notification.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-2 leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-indigo-800/80'}`}>
                                            {notification.message}
                                        </p>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors w-fit"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Okundu olarak işaretle
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
