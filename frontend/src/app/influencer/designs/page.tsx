"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { Loader2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function InfluencerDesigns() {
    const { data: designs, isLoading } = useQuery({
        queryKey: ['influencerDesigns'],
        queryFn: async () => {
            const res = await api.get('/influencer/designs');
            return res.data;
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Tasarımlarım</h1>
                <Link href="/influencer/design/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Upload className="mr-2 h-5 w-5" />
                    Yeni Tasarım Yükle
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Görsel
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Başlık
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fiyat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Satış
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {designs?.map((design: any) => (
                                        <tr key={design._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={design.images.thumbnail?.startsWith('http') ? design.images.thumbnail : `http://127.0.0.1:5000${design.images.thumbnail || design.images.original}`} alt="" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{design.title}</div>
                                                <div className="text-sm text-gray-500">{design.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">₺{design.price}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{design.sales}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${design.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    design.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {design.status === 'published' ? 'Yayında' : design.status === 'draft' ? 'Taslak' : 'Reddedildi'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!designs || designs.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                Henüz hiç tasarım yüklemediniz.
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
