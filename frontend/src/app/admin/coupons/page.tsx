'use client';

import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Trash2, Plus, User, Calendar, Percent, DollarSign } from 'lucide-react';

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minPurchaseAmount: number;
    expirationDate: string;
    assignedToUser?: string;
    usageLimit: number;
    usedCount: number;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchaseAmount: '',
        expirationDate: '',
        usageLimit: '',
        assignedToUser: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/coupons', {
                ...formData,
                discountValue: Number(formData.discountValue),
                minPurchaseAmount: Number(formData.minPurchaseAmount),
                usageLimit: Number(formData.usageLimit) || 1000000,
                assignedToUser: formData.assignedToUser || undefined
            });
            setShowForm(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minPurchaseAmount: '',
                expirationDate: '',
                usageLimit: '',
                assignedToUser: ''
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('Kupon oluşturulurken hata oluştu.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Kupon Yönetimi</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Kupon
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Yeni Kupon Oluştur</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kupon Kodu</label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="ORN: YAZ2024"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İndirim Tipi</label>
                            <select
                                value={formData.discountType}
                                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="percentage">Yüzde (%)</option>
                                <option value="fixed_amount">Sabit Tutar (TL)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İndirim Değeri</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.discountValue}
                                onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sepet Tutarı</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minPurchaseAmount}
                                onChange={e => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                            <input
                                type="date"
                                required
                                value={formData.expirationDate}
                                onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı ID (Opsiyonel)</label>
                            <input
                                type="text"
                                value={formData.assignedToUser}
                                onChange={e => setFormData({ ...formData, assignedToUser: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Özel indirim için User ID"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Oluştur
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kod</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">İndirim</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Son Kullanma</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kullanım</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Özel</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        {coupon.discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                        {coupon.discountValue}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(coupon.expirationDate).toLocaleDateString('tr-TR')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {coupon.usedCount} / {coupon.usageLimit > 99999 ? '∞' : coupon.usageLimit}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {coupon.assignedToUser ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                                            <User className="w-3 h-3" /> Özel
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
