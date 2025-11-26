"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Type, Square, Circle, Image as ImageIcon, Download, Upload, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';

export default function DesignCreator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishData, setPublishData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: 'tshirt',
    });
    const router = useRouter();

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current && !canvas) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: bgColor,
            });
            setCanvas(fabricCanvas);

            return () => {
                fabricCanvas.dispose();
            };
        }
    }, []);

    // Update background color
    useEffect(() => {
        if (canvas) {
            canvas.backgroundColor = bgColor;
            canvas.renderAll();
        }
    }, [bgColor, canvas]);

    // Add text
    const addText = () => {
        if (!canvas) return;
        const text = new fabric.IText('Metninizi yazın', {
            left: 100,
            top: 100,
            fill: selectedColor,
            fontSize: 30,
            fontFamily: 'Arial',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    };

    // Add rectangle
    const addRectangle = () => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 100,
            fill: selectedColor,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
    };

    // Add circle
    const addCircle = () => {
        if (!canvas) return;
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: selectedColor,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
    };

    // Upload image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canvas) return;
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgUrl = event.target?.result as string;
            fabric.FabricImage.fromURL(imgUrl).then((img) => {
                img.scaleToWidth(200);
                img.set({ left: 100, top: 100 });
                canvas.add(img);
                canvas.setActiveObject(img);
            });
        };
        reader.readAsDataURL(file);
    };

    // Delete selected object
    const deleteSelected = () => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    };

    // Export as PNG
    const exportDesign = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1,
        });
        const link = document.createElement('a');
        link.download = 'tasarim.png';
        link.href = dataURL;
        link.click();
    };

    // Publish design
    const publishDesign = async () => {
        if (!canvas) return;
        setShowPublishModal(true);
    };

    const handlePublishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canvas) return;

        setIsPublishing(true);
        try {
            // Export canvas as blob
            const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
            const blob = await (await fetch(dataURL)).blob();
            const file = new File([blob], 'design.png', { type: 'image/png' });

            const formData = new FormData();
            formData.append('title', publishData.title);
            formData.append('description', publishData.description);
            formData.append('price', publishData.price);
            formData.append('stock', publishData.stock);
            formData.append('category', publishData.category);
            formData.append('image', file);

            const res = await api.post('/designs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Tasarım başarıyla yayınlandı!');
            setShowPublishModal(false);
            router.push(`/design/${res.data._id}`);
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || 'Tasarım yayınlanırken hata oluştu.');
        } finally {
            setIsPublishing(false);
        }
    };

    // Load template
    const loadTemplate = (templateType: string) => {
        if (!canvas) return;
        canvas.clear();

        if (templateType === 'tshirt') {
            setBgColor('#ffffff');
            const text = new fabric.IText('T-SHIRT TASARIMI', {
                left: 250,
                top: 250,
                fill: '#000000',
                fontSize: 40,
                fontWeight: 'bold',
                fontFamily: 'Arial',
            });
            canvas.add(text);
        } else if (templateType === 'poster') {
            setBgColor('#1a1a1a');
            const title = new fabric.IText('POSTER BAŞLIĞI', {
                left: 200,
                top: 100,
                fill: '#ffffff',
                fontSize: 50,
                fontWeight: 'bold',
                fontFamily: 'Arial',
            });
            const subtitle = new fabric.IText('Alt başlık buraya', {
                left: 250,
                top: 180,
                fill: '#cccccc',
                fontSize: 25,
                fontFamily: 'Arial',
            });
            canvas.add(title, subtitle);
        } else if (templateType === 'mug') {
            setBgColor('#f0f0f0');
            const circle = new fabric.Circle({
                left: 300,
                top: 200,
                radius: 80,
                fill: '#ff6b6b',
            });
            const text = new fabric.IText('KUPA', {
                left: 350,
                top: 270,
                fill: '#ffffff',
                fontSize: 30,
                fontWeight: 'bold',
                fontFamily: 'Arial',
            });
            canvas.add(circle, text);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Tasarım Oluştur</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Toolbar */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Tools */}
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 mb-4">Araçlar</h3>

                        <button
                            onClick={addText}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                        >
                            <Type className="w-5 h-5" />
                            Metin Ekle
                        </button>

                        <button
                            onClick={addRectangle}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                            <Square className="w-5 h-5" />
                            Dikdörtgen
                        </button>

                        <button
                            onClick={addCircle}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                        >
                            <Circle className="w-5 h-5" />
                            Daire
                        </button>

                        <label className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium cursor-pointer">
                            <ImageIcon className="w-5 h-5" />
                            Resim Yükle
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={deleteSelected}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            <Trash2 className="w-5 h-5" />
                            Sil
                        </button>
                    </div>

                    {/* Colors */}
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 mb-4">Renkler</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nesne Rengi</label>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Arka Plan</label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Templates */}
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 mb-4">Şablonlar</h3>

                        <button
                            onClick={() => loadTemplate('tshirt')}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            T-Shirt
                        </button>

                        <button
                            onClick={() => loadTemplate('poster')}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            Poster
                        </button>

                        <button
                            onClick={() => loadTemplate('mug')}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            Kupa
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-center mb-6">
                            <div className="border-4 border-gray-200 rounded-lg overflow-hidden shadow-inner">
                                <canvas ref={canvasRef} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={exportDesign}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                PNG İndir
                            </button>

                            <button
                                onClick={publishDesign}
                                disabled={isPublishing}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold shadow-lg disabled:opacity-50"
                            >
                                <Upload className="w-5 h-5" />
                                {isPublishing ? 'Yayınlanıyor...' : 'Tasarımı Yayınla'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tasarımı Yayınla</h2>

                        <form onSubmit={handlePublishSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tasarım Adı *</label>
                                <input
                                    type="text"
                                    required
                                    value={publishData.title}
                                    onChange={(e) => setPublishData({ ...publishData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Örn: Minimal Logo Tasarımı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                                <textarea
                                    value={publishData.description}
                                    onChange={(e) => setPublishData({ ...publishData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Tasarımınız hakkında kısa bir açıklama..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={publishData.price}
                                        onChange={(e) => setPublishData({ ...publishData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="99.90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={publishData.stock}
                                        onChange={(e) => setPublishData({ ...publishData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                                <select
                                    required
                                    value={publishData.category}
                                    onChange={(e) => setPublishData({ ...publishData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="tshirt">T-Shirt</option>
                                    <option value="hoodie">Hoodie</option>
                                    <option value="sweatshirt">Sweatshirt</option>
                                    <option value="mug">Kupa</option>
                                    <option value="poster">Poster</option>
                                    <option value="sticker">Sticker</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold disabled:opacity-50"
                                >
                                    <Upload className="w-5 h-5" />
                                    {isPublishing ? 'Yayınlanıyor...' : 'Yayınla'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowPublishModal(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
