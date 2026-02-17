"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import {
    Type, Square, Circle, Image as ImageIcon, Download, Trash2,
    Palette, Undo, Redo, ZoomIn, ZoomOut, Save,
    LayoutTemplate, Settings, MousePointer2, Triangle,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    BringToFront, SendToBack, X, Eye, CheckCircle, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';

const FONTS = ['Inter', 'Arial', 'Impact', 'Georgia', 'Courier New', 'Trebuchet MS', 'Verdana', 'Times New Roman'];
const PRESET_COLORS = ['#000000', '#FFFFFF', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#F97316'];

export default function DesignCreator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [activeTool, setActiveTool] = useState('select');
    const [zoom, setZoom] = useState(100);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [canvasPreview, setCanvasPreview] = useState<string | null>(null);

    // History for undo/redo
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isLoadingHistoryRef = useRef(false);

    // Selected object properties
    const [selectedObj, setSelectedObj] = useState<fabric.Object | null>(null);
    const [objOpacity, setObjOpacity] = useState(100);
    const [strokeColor, setStrokeColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(0);
    const [fontSize, setFontSize] = useState(40);
    const [fontFamily, setFontFamily] = useState('Inter');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textAlign, setTextAlign] = useState('left');

    const { user } = useAuthStore();
    const router = useRouter();

    const [publishData, setPublishData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: 'tshirt',
    });

    // Save history snapshot
    const saveHistory = useCallback(() => {
        if (!canvas || isLoadingHistoryRef.current) return;
        const json = JSON.stringify(canvas.toJSON());
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        historyRef.current.push(json);
        historyIndexRef.current = historyRef.current.length - 1;
    }, [canvas]);

    // Sync selected object properties to state
    const syncSelectedProps = useCallback((obj: fabric.Object | null) => {
        if (!obj) {
            setSelectedObj(null);
            return;
        }
        setSelectedObj(obj);
        setObjOpacity(Math.round((obj.opacity ?? 1) * 100));
        setStrokeColor((obj.stroke as string) || 'transparent');
        setStrokeWidth(obj.strokeWidth ?? 0);
        if (obj instanceof fabric.IText || obj instanceof fabric.Textbox) {
            setFontSize((obj as any).fontSize || 40);
            setFontFamily((obj as any).fontFamily || 'Inter');
            setIsBold((obj as any).fontWeight === 'bold');
            setIsItalic((obj as any).fontStyle === 'italic');
            setIsUnderline(!!(obj as any).underline);
            setTextAlign((obj as any).textAlign || 'left');
        }
    }, []);

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current || canvas) return;

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 600,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
            selection: true,
        });

        // Events
        fabricCanvas.on('selection:created', (e) => syncSelectedProps(e.selected?.[0] || null));
        fabricCanvas.on('selection:updated', (e) => syncSelectedProps(e.selected?.[0] || null));
        fabricCanvas.on('selection:cleared', () => syncSelectedProps(null));
        fabricCanvas.on('object:modified', () => saveHistory());
        fabricCanvas.on('object:added', () => saveHistory());
        fabricCanvas.on('object:removed', () => saveHistory());

        setCanvas(fabricCanvas);

        // Save initial state
        setTimeout(() => {
            const json = JSON.stringify(fabricCanvas.toJSON());
            historyRef.current = [json];
            historyIndexRef.current = 0;
        }, 100);

        return () => { fabricCanvas.dispose(); };
    }, []);

    // Update saveHistory when canvas changes
    useEffect(() => {
        if (!canvas) return;
        canvas.off('object:modified');
        canvas.off('object:added');
        canvas.off('object:removed');
        canvas.on('object:modified', saveHistory);
        canvas.on('object:added', saveHistory);
        canvas.on('object:removed', saveHistory);
    }, [canvas, saveHistory]);

    // Update BG Color
    useEffect(() => {
        if (canvas) {
            canvas.backgroundColor = bgColor;
            canvas.renderAll();
        }
    }, [bgColor, canvas]);

    // Apply zoom to canvas
    useEffect(() => {
        if (!canvas) return;
        const scale = zoom / 100;
        canvas.setZoom(scale);
        canvas.setDimensions({ width: 600 * scale, height: 600 * scale });
        canvas.renderAll();
    }, [zoom, canvas]);

    const addToCanvas = (obj: fabric.Object) => {
        if (!canvas) return;
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
    };

    const addText = () => {
        addToCanvas(new fabric.IText('Metni Düzenle', {
            left: 150, top: 250,
            fill: selectedColor,
            fontSize: 40,
            fontFamily: 'Inter',
            fontWeight: 'bold',
        }));
        setActiveTool('text');
    };

    const addRectangle = () => {
        addToCanvas(new fabric.Rect({
            left: 200, top: 200, width: 160, height: 110,
            fill: selectedColor, rx: 8, ry: 8,
        }));
        setActiveTool('shape');
    };

    const addCircle = () => {
        addToCanvas(new fabric.Circle({
            left: 250, top: 240, radius: 70, fill: selectedColor,
        }));
        setActiveTool('shape');
    };

    const addTriangle = () => {
        addToCanvas(new fabric.Triangle({
            left: 220, top: 200, width: 140, height: 120, fill: selectedColor,
        }));
        setActiveTool('shape');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canvas) return;
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgUrl = event.target?.result as string;
            fabric.FabricImage.fromURL(imgUrl).then((img) => {
                img.scaleToWidth(220);
                img.set({ left: 180, top: 180 });
                addToCanvas(img);
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const deleteSelected = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
            canvas.discardActiveObject();
            activeObjects.forEach((obj) => canvas.remove(obj));
            canvas.renderAll();
            syncSelectedProps(null);
        }
    };

    // Undo
    const undo = () => {
        if (!canvas || historyIndexRef.current <= 0) return;
        isLoadingHistoryRef.current = true;
        historyIndexRef.current--;
        const json = historyRef.current[historyIndexRef.current];
        (canvas as any).loadFromJSON(json, () => {
            canvas.renderAll();
            isLoadingHistoryRef.current = false;
        });
    };

    // Redo
    const redo = () => {
        if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;
        isLoadingHistoryRef.current = true;
        historyIndexRef.current++;
        const json = historyRef.current[historyIndexRef.current];
        (canvas as any).loadFromJSON(json, () => {
            canvas.renderAll();
            isLoadingHistoryRef.current = false;
        });
    };

    // Object color change
    const handleObjectColorChange = (color: string) => {
        setSelectedColor(color);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
            active.set({ fill: color });
            canvas.renderAll();
        }
    };

    // Opacity change
    const handleOpacityChange = (val: number) => {
        setObjOpacity(val);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
            active.set({ opacity: val / 100 });
            canvas.renderAll();
        }
    };

    // Stroke change
    const handleStrokeChange = (color: string, width: number) => {
        setStrokeColor(color);
        setStrokeWidth(width);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
            active.set({ stroke: color, strokeWidth: width });
            canvas.renderAll();
        }
    };

    // Font size
    const handleFontSizeChange = (size: number) => {
        setFontSize(size);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            (active as any).set({ fontSize: size });
            canvas.renderAll();
        }
    };

    // Font family
    const handleFontFamilyChange = (family: string) => {
        setFontFamily(family);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            (active as any).set({ fontFamily: family });
            canvas.renderAll();
        }
    };

    // Bold
    const toggleBold = () => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            const newBold = !isBold;
            setIsBold(newBold);
            (active as any).set({ fontWeight: newBold ? 'bold' : 'normal' });
            canvas.renderAll();
        }
    };

    // Italic
    const toggleItalic = () => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            const newItalic = !isItalic;
            setIsItalic(newItalic);
            (active as any).set({ fontStyle: newItalic ? 'italic' : 'normal' });
            canvas.renderAll();
        }
    };

    // Underline
    const toggleUnderline = () => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            const newUl = !isUnderline;
            setIsUnderline(newUl);
            (active as any).set({ underline: newUl });
            canvas.renderAll();
        }
    };

    // Text align
    const handleTextAlign = (align: string) => {
        setTextAlign(align);
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active instanceof fabric.IText || active instanceof fabric.Textbox) {
            (active as any).set({ textAlign: align });
            canvas.renderAll();
        }
    };

    // Layer order
    const bringForward = () => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) { canvas.bringObjectForward(active); canvas.renderAll(); }
    };

    const sendBackward = () => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) { canvas.sendObjectBackwards(active); canvas.renderAll(); }
    };

    // Download
    const handleDownload = () => {
        if (!canvas) return;
        const origZoom = canvas.getZoom();
        canvas.setZoom(1);
        canvas.setDimensions({ width: 600, height: 600 });
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
        canvas.setZoom(origZoom);
        canvas.setDimensions({ width: 600 * origZoom, height: 600 * origZoom });
        const link = document.createElement('a');
        link.download = 'tasarim.png';
        link.href = dataURL;
        link.click();
        toast.success('Tasarım indirildi!');
    };

    // Load template
    const loadTemplate = (type: string) => {
        if (!canvas) return;
        canvas.clear();
        setBgColor('#ffffff');

        if (type === 'tshirt') {
            const rect = new fabric.Rect({ left: 150, top: 100, width: 300, height: 400, fill: '#f1f5f9', rx: 20, stroke: '#cbd5e1', strokeWidth: 2 });
            const text = new fabric.IText('KOLEKSİYON', { left: 160, top: 260, fontSize: 36, fontWeight: 'bold', fontFamily: 'Impact', fill: '#1e293b', textAlign: 'center' });
            canvas.add(rect, text);
        } else if (type === 'poster') {
            setBgColor('#0f172a');
            const title = new fabric.IText('POSTER TASARIM', { left: 80, top: 200, fontSize: 52, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Impact' });
            const sub = new fabric.IText('Alt başlık yazısı', { left: 190, top: 300, fontSize: 22, fill: '#94a3b8', fontFamily: 'Inter' });
            canvas.add(title, sub);
        } else if (type === 'minimal') {
            const circle = new fabric.Circle({ left: 225, top: 225, radius: 120, fill: 'transparent', stroke: '#6366f1', strokeWidth: 3 });
            const text = new fabric.IText('MINIMAL', { left: 180, top: 273, fontSize: 44, fill: '#6366f1', fontWeight: 'bold', fontFamily: 'Inter' });
            canvas.add(circle, text);
        }
        canvas.renderAll();
        saveHistory();
    };

    // Open publish modal with preview
    const openPublishModal = () => {
        if (!canvas) return;
        const origZoom = canvas.getZoom();
        canvas.setZoom(1);
        canvas.setDimensions({ width: 600, height: 600 });
        const preview = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 1 });
        canvas.setZoom(origZoom);
        canvas.setDimensions({ width: 600 * origZoom, height: 600 * origZoom });
        setCanvasPreview(preview);
        setShowPublishModal(true);
    };

    // Publish
    const handlePublishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canvas) return;
        if (!publishData.title.trim()) { toast.error('Tasarım başlığı zorunludur'); return; }
        if (!publishData.price || Number(publishData.price) <= 0) { toast.error('Geçerli bir fiyat girin'); return; }

        setIsPublishing(true);
        const toastId = toast.loading('Tasarım yayınlanıyor...');

        try {
            const origZoom = canvas.getZoom();
            canvas.setZoom(1);
            canvas.setDimensions({ width: 600, height: 600 });
            const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
            canvas.setZoom(origZoom);
            canvas.setDimensions({ width: 600 * origZoom, height: 600 * origZoom });

            const blob = await (await fetch(dataURL)).blob();
            const file = new File([blob], 'design.png', { type: 'image/png' });

            const formData = new FormData();
            formData.append('title', publishData.title);
            formData.append('description', publishData.description);
            formData.append('price', publishData.price);
            formData.append('stock', publishData.stock || '999');
            formData.append('category', publishData.category);
            formData.append('image', file);

            const res = await api.post('/designs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Tasarım başarıyla yayınlandı!', { id: toastId });
            setShowPublishModal(false);
            const designId = res.data._id || res.data?.data?._id;
            if (designId) {
                router.push(`/design/${designId}`);
            } else {
                router.push('/influencer/designs');
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Hata oluştu. Tekrar deneyin.';
            toast.error(msg, { id: toastId });
        } finally {
            setIsPublishing(false);
        }
    };

    const isTextSelected = selectedObj instanceof fabric.IText || selectedObj instanceof fabric.Textbox;
    const canUndo = historyIndexRef.current > 0;
    const canRedo = historyIndexRef.current < historyRef.current.length - 1;

    return (
        <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] -m-4 md:-m-8 lg:-m-10 flex flex-col bg-[#0F172A] overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 z-10 shrink-0 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <h1 className="text-white font-bold text-base hidden sm:flex items-center gap-2 shrink-0">
                        <Palette className="w-4 h-4 text-indigo-400" />
                        Studio
                    </h1>
                    <div className="hidden sm:block h-4 w-px bg-slate-700" />
                    <div className="flex items-center bg-slate-800/80 rounded-lg overflow-hidden border border-slate-700/50">
                        <button onClick={undo} disabled={!canUndo} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <Undo className="w-4 h-4" />
                        </button>
                        <button onClick={redo} disabled={!canRedo} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center bg-slate-800/80 rounded-lg overflow-hidden border border-slate-700/50">
                        <button onClick={() => setZoom(Math.max(25, zoom - 10))} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-slate-300 w-10 text-center font-mono">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hidden sm:inline">TASLAK</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-slate-700">
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">İndir</span>
                    </button>
                    <button
                        onClick={openPublishModal}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-indigo-500/25"
                    >
                        <Save className="w-3.5 h-3.5" />
                        Yayınla
                    </button>
                </div>
            </header>

            {/* Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Toolbar */}
                <aside className="w-14 flex flex-col items-center py-4 gap-1.5 border-r border-slate-800/80 bg-slate-900/50 z-10 overflow-y-auto">
                    <TooltipBtn text="Seç" icon={MousePointer2} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
                    <div className="w-8 h-px bg-slate-800 my-1" />
                    <TooltipBtn text="Metin" icon={Type} active={activeTool === 'text'} onClick={addText} />
                    <TooltipBtn text="Dikdörtgen" icon={Square} active={activeTool === 'rect'} onClick={addRectangle} />
                    <TooltipBtn text="Daire" icon={Circle} active={activeTool === 'circle'} onClick={addCircle} />
                    <TooltipBtn text="Üçgen" icon={Triangle} active={activeTool === 'triangle'} onClick={addTriangle} />
                    <div className="w-8 h-px bg-slate-800 my-1" />
                    <label className="p-2.5 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-400 transition-colors cursor-pointer group relative" title="Resim Yükle">
                        <ImageIcon className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <div className="w-8 h-px bg-slate-800 my-1" />
                    <TooltipBtn text="T-Shirt" icon={LayoutTemplate} onClick={() => loadTemplate('tshirt')} />
                    <TooltipBtn text="Poster" icon={LayoutTemplate} onClick={() => loadTemplate('poster')} />
                    <TooltipBtn text="Minimal" icon={LayoutTemplate} onClick={() => loadTemplate('minimal')} />
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 bg-[#020617] relative flex items-center justify-center overflow-auto">
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative shadow-2xl shadow-black/60 overflow-hidden rounded transition-all duration-200">
                        <canvas ref={canvasRef} />
                    </div>
                </main>

                {/* Right Properties Panel */}
                <aside className="w-68 border-l border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex flex-col z-10 overflow-hidden" style={{ width: '272px' }}>
                    <div className="p-3.5 border-b border-slate-800/80 font-semibold text-slate-200 flex items-center gap-2 text-sm shrink-0">
                        <Settings className="w-4 h-4 text-indigo-400" />
                        Özellikler
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Nesne Rengi */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nesne Rengi</label>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => handleObjectColorChange(color)}
                                        title={color}
                                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color ? 'border-indigo-400 scale-110 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-500">Özel:</label>
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg border border-slate-700 overflow-hidden cursor-pointer" style={{ backgroundColor: selectedColor }}>
                                        <input
                                            type="color"
                                            value={selectedColor}
                                            onChange={(e) => handleObjectColorChange(e.target.value)}
                                            className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-400">{selectedColor}</span>
                            </div>
                        </div>

                        {/* Metin Kontrolleri */}
                        {isTextSelected && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metin</label>

                                {/* Font Family */}
                                <select
                                    value={fontFamily}
                                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-indigo-500 transition-colors"
                                >
                                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>

                                {/* Font Size */}
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-500 shrink-0">Boyut:</label>
                                    <input
                                        type="number"
                                        value={fontSize}
                                        onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                                        min={8} max={200}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-indigo-500 text-center"
                                    />
                                    <span className="text-xs text-slate-600">px</span>
                                </div>

                                {/* Style Buttons */}
                                <div className="flex gap-1.5">
                                    <button onClick={toggleBold} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${isBold ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                                        <Bold className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button onClick={toggleItalic} className={`flex-1 py-2 rounded-lg text-xs transition-all ${isItalic ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                                        <Italic className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button onClick={toggleUnderline} className={`flex-1 py-2 rounded-lg text-xs transition-all ${isUnderline ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                                        <Underline className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>

                                {/* Text Align */}
                                <div className="flex gap-1.5">
                                    {[
                                        { align: 'left', icon: AlignLeft },
                                        { align: 'center', icon: AlignCenter },
                                        { align: 'right', icon: AlignRight },
                                    ].map(({ align, icon: Icon }) => (
                                        <button
                                            key={align}
                                            onClick={() => handleTextAlign(align)}
                                            className={`flex-1 py-2 rounded-lg transition-all ${textAlign === align ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                        >
                                            <Icon className="w-4 h-4 mx-auto" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Opacity */}
                        {selectedObj && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saydamlık</label>
                                    <span className="text-xs font-mono text-slate-400">{objOpacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0} max={100}
                                    value={objOpacity}
                                    onChange={(e) => handleOpacityChange(Number(e.target.value))}
                                    className="w-full accent-indigo-500"
                                />
                            </div>
                        )}

                        {/* Stroke */}
                        {selectedObj && !isTextSelected && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kenarlık</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                                        <input
                                            type="color"
                                            value={strokeColor === 'transparent' ? '#6366f1' : strokeColor}
                                            onChange={(e) => handleStrokeChange(e.target.value, strokeWidth || 2)}
                                            className="opacity-0 absolute inset-0 cursor-pointer"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: strokeColor === 'transparent' ? '#6366f1' : strokeColor }} />
                                    </div>
                                    <input
                                        type="number"
                                        value={strokeWidth}
                                        onChange={(e) => handleStrokeChange(strokeColor, Number(e.target.value))}
                                        min={0} max={20}
                                        placeholder="Kalınlık"
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-indigo-500 text-center"
                                    />
                                    <span className="text-xs text-slate-600">px</span>
                                </div>
                            </div>
                        )}

                        {/* Arka Plan */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Arka Plan</label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="opacity-0 absolute inset-0 cursor-pointer"
                                    />
                                    <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
                                </div>
                                <div className="flex gap-1.5">
                                    {['#ffffff', '#000000', '#0f172a', '#f1f5f9'].map(c => (
                                        <button key={c} onClick={() => setBgColor(c)}
                                            className={`w-6 h-6 rounded-md border-2 transition-all ${bgColor === c ? 'border-indigo-400' : 'border-white/10'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Katman Sırası */}
                        {selectedObj && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Katman</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={bringForward} className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors">
                                        <BringToFront className="w-3.5 h-3.5" /> Öne
                                    </button>
                                    <button onClick={sendBackward} className="flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors">
                                        <SendToBack className="w-3.5 h-3.5" /> Arkaya
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Delete */}
                        {selectedObj && (
                            <button
                                onClick={deleteSelected}
                                className="w-full py-2.5 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Seçiliyi Sil
                            </button>
                        )}

                        {!selectedObj && (
                            <div className="py-8 text-center text-slate-600">
                                <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-xs">Bir nesne seçin</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Publish Modal */}
            <AnimatePresence>
                {showPublishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Tasarımı Yayınla</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Bilgileri doldurun ve tasarımınızı satışa çıkarın</p>
                                </div>
                                <button onClick={() => setShowPublishModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handlePublishSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Preview */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Önizleme</label>
                                        {canvasPreview && (
                                            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                                                <img src={canvasPreview} alt="Preview" className="w-full object-contain" />
                                                <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/30 rounded-md px-2 py-0.5 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-[10px] text-emerald-400 font-medium">Hazır</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300">
                                            Tasarım PNG formatında 1200×1200px çözünürlükte yüklenecek.
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tasarım Başlığı *</label>
                                            <input
                                                type="text"
                                                value={publishData.title}
                                                onChange={e => setPublishData({ ...publishData, title: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                                placeholder="Örn: Minimalist Logo Tasarım"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Açıklama</label>
                                            <textarea
                                                value={publishData.description}
                                                onChange={e => setPublishData({ ...publishData, description: e.target.value })}
                                                rows={2}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-600"
                                                placeholder="Tasarımı kısaca anlatan bir açıklama..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Fiyat (₺) *</label>
                                                <input
                                                    type="number"
                                                    value={publishData.price}
                                                    onChange={e => setPublishData({ ...publishData, price: e.target.value })}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="149"
                                                    min={1}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Stok</label>
                                                <input
                                                    type="number"
                                                    value={publishData.stock}
                                                    onChange={e => setPublishData({ ...publishData, stock: e.target.value })}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="999"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kategori</label>
                                            <select
                                                value={publishData.category}
                                                onChange={e => setPublishData({ ...publishData, category: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="tshirt">T-Shirt</option>
                                                <option value="hoodie">Hoodie</option>
                                                <option value="mug">Kupa</option>
                                                <option value="poster">Poster</option>
                                                <option value="phone-case">Telefon Kılıfı</option>
                                                <option value="sticker">Sticker</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-5 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowPublishModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-colors text-sm"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPublishing}
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Yayınlanıyor...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Yayına Al
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TooltipBtn({ icon: Icon, active, onClick, text }: {
    icon: any; active?: boolean; onClick: () => void; text: string
}) {
    return (
        <button
            onClick={onClick}
            title={text}
            className={`p-2.5 rounded-xl transition-all duration-200 relative group ${
                active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700 shadow-lg">
                {text}
            </span>
        </button>
    );
}
