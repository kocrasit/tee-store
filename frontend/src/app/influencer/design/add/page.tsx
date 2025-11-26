"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';

export default function AddInfluencerDesign() {
    const { register, handleSubmit, reset } = useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('stock', data.stock);
            formData.append('category', data.category);

            if (data.tags) {
                const tagsArray = data.tags.split(',').map((tag: string) => tag.trim());
                tagsArray.forEach((tag: string) => formData.append('tags[]', tag));
            }

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput && fileInput.files && fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            const res = await api.post('/designs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const createdDesign = res.data;

            alert('Tasarım başarıyla yüklendi!');
            router.push(`/design/${createdDesign._id}`);
            reset();
            setPreviewImage(null);
        } catch (error: any) {
            console.error(error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Tasarım yüklenirken bir hata oluştu.';
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Yeni Tasarım Yükle</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tasarım Adı</label>
                            <input
                                {...register('title', { required: true })}
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hikayesi / Açıklama</label>
                            <textarea
                                {...register('description', { required: true })}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Bu tasarımın hikayesi nedir?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Satış Fiyatı (₺)</label>
                            <input
                                {...register('price', { required: true })}
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stok Adedi</label>
                            <input
                                {...register('stock', { required: true, min: 0 })}
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Örn: 100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                {...register('category', { required: true })}
                                defaultValue="tshirt"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            >
                                <option value="tshirt">T-Shirt</option>
                                <option value="hoodie">Hoodie</option>
                                <option value="sweatshirt">Sweatshirt</option>
                                <option value="mug">Kupa</option>
                                <option value="poster">Poster</option>
                                <option value="sticker">Sticker</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Etiketler (Virgülle ayırın)</label>
                            <input
                                {...register('tags')}
                                type="text"
                                placeholder="yaz, modern, siyah"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
                        >
                            <Upload className="mr-2 h-5 w-5" />
                            {isLoading ? 'Yükleniyor...' : 'Tasarımı Yayınla'}
                        </button>
                    </div>

                    {/* Image Upload & Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tasarım Görseli</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-500 transition-colors cursor-pointer relative h-64">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="h-full w-full object-contain" />
                            ) : (
                                <div className="space-y-1 text-center flex flex-col items-center justify-center h-full">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                                            Dosya Seç
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG (Max 10MB)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
