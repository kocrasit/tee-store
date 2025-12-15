'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
  { name: 'Blue', class: 'bg-blue-700', selectedClass: 'ring-blue-700' },
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  // In Next.js 15+, params is async, but for simplicity in this client component setup:
  // Note: In real implementation with server components, we fetch data based on params.id

  const { data, isLoading, error } = useQuery({
    queryKey: ['design', params.id],
    queryFn: async () => {
      const res = await api.get(`/designs/${params.id}`);
      return res.data;
    },
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Yorum yapmak için giriş yapmalısınız.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/designs/${params.id}/reviews`, { rating, comment });
      alert('Değerlendirmeniz alındı!');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['design', params.id] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Değerlendirme gönderilemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-500">Ürün yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  const design: any = data;

  const product = {
    id: design._id,
    title: design.title,
    price: design.price,
    description: design.description,
    images: [design.images?.preview, design.images?.original].filter(Boolean) as string[],
    category: design.category,
    rating: typeof design.rating === 'number' ? design.rating : 0,
    reviewsCount: Array.isArray(design.reviews) ? design.reviews.length : 0,
    reviews: design.reviews || [],
    sizes: SIZES,
    colors: COLORS,
    stock: design.stock || 0,
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `http://127.0.0.1:5000${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const images = product.images.length > 0
    ? product.images.map(getImageUrl)
    : ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'];

  const displayImage = activeImage ? getImageUrl(activeImage) : images[0];

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[0],
      size: selectedSize,
      color: selectedColor.name,
      quantity: quantity,
      designId: product.id
    });
    alert('Ürün sepete eklendi!');
  };

  return (
    <div className="min-h-screen bg-black pb-24 pt-12 relative overflow-hidden">
      {/* Background Effects - Cold Blue-Gray Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-slate-800/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-gray-800/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Alışverişe Dön
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse gap-6">
            {/* Image selector */}
            <div className="hidden w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4" aria-orientation="horizontal" role="tablist">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className="relative h-24 bg-white/5 rounded-xl flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-white/10 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500/50 overflow-hidden border border-white/5"
                    onClick={() => setActiveImage(img)}
                  >
                    <span className="sr-only">Image {idx + 1}</span>
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-center object-cover" />
                    </span>
                    <span className={`absolute inset-0 rounded-xl ring-2 ring-offset-2 pointer-events-none ${activeImage === img ? 'ring-slate-400' : 'ring-transparent'}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-white/5 border border-white/5 sm:aspect-w-4 sm:aspect-h-3 lg:aspect-none lg:h-[600px] shadow-2xl relative">
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-center object-cover sm:rounded-2xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="mb-6">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-xs bg-slate-400/10 px-3 py-1 rounded-full border border-slate-400/20">{product.category}</span>
              <h1 className="text-4xl font-black tracking-tight text-white mt-4 tracking-tighter">{product.title}</h1>
            </div>

            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-bold text-white">₺{product.price.toFixed(2)}</p>
            </div>

            {/* Reviews Summary */}
            <div className="mt-4">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${product.rating > rating ? 'text-slate-200 fill-current' : 'text-gray-700'
                        }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">
                  {product.reviewsCount} değerlendirme
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="sr-only">Description</h3>
              <div
                className="text-base text-gray-400 space-y-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <form className="mt-8 border-t border-white/5 pt-8">
              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Stokta Var ({product.stock} adet)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                    Tükendi
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="mt-6">
                <h3 className="text-sm text-gray-300 font-bold uppercase tracking-wider mb-3">Renk</h3>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 border-white/10 cursor-pointer focus:outline-none transition-transform hover:scale-110 ${color.class} ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-offset-black ' + color.selectedClass : ''}`}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300 font-bold uppercase tracking-wider">Beden</h3>
                  <a href="#" className="text-xs font-medium text-gray-500 hover:text-white transition-colors">
                    Beden Tablosu
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-xl py-3 px-3 flex items-center justify-center text-sm font-bold uppercase sm:flex-1 cursor-pointer focus:outline-none transition-all ${selectedSize === size ? 'bg-slate-200 border-transparent text-black hover:bg-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-white/5 border border-white/5 rounded-xl w-32">
                  <button
                    type="button"
                    className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                  >-</button>
                  <input
                    type="number"
                    className="w-full text-center bg-transparent border-none focus:ring-0 p-0 text-white font-bold"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                  >+</button>
                </div>
                <button
                  type="submit"
                  disabled={product.stock <= 0}
                  className="flex-1 bg-white text-black border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock > 0 ? 'Sepete Ekle' : 'Tükendi'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 border-t border-white/5 pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <p className="ml-3 text-sm text-gray-400">Güvenli Ödeme & %100 Müşteri Memnuniyeti</p>
                </div>
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <p className="ml-3 text-sm text-gray-400">Hızlı Kargo & Kolay İade</p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-32 pt-16 border-t border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Müşteri Değerlendirmeleri</h2>
              <p className="mt-2 text-gray-400">Bu ürün hakkında yapılan son yorumlar</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl">
              <Star className="w-6 h-6 text-slate-200 fill-current" />
              <span className="font-bold text-white text-xl">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500">/ 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 font-bold text-lg">Henüz değerlendirme yapılmamış.</p>
                  <p className="text-sm text-gray-500">İlk değerlendiren siz olun ve deneyiminizi paylaşın!</p>
                </div>
              ) : (
                product.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="glass-anthracite p-8 rounded-3xl transition-all duration-300 hover:border-white/10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white font-black text-lg uppercase border border-white/5">
                          {review.userId?.firstName ? review.userId.firstName.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${review.rating >= star ? 'text-slate-200 fill-current' : 'text-gray-700'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-base">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-5">
              <div className="glass-anthracite p-8 rounded-3xl shadow-2xl sticky top-24">
                <h3 className="text-xl font-bold text-white mb-2">Değerlendirme Yap</h3>
                <p className="text-gray-400 text-sm mb-8">Ürünü satın aldınız mı? Deneyiminizi paylaşın.</p>

                <form onSubmit={submitReview} className="relative">
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Puanınız</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setRating(star)}
                            className="focus:outline-none group transition-all duration-200 hover:scale-110"
                          >
                            <Star
                              className={`h-9 w-9 transition-all duration-200 ${rating >= star
                                ? 'text-slate-200 fill-current drop-shadow-[0_0_10px_rgba(226,232,240,0.5)]'
                                : 'text-gray-700 group-hover:text-slate-200'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="h-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-md transition-all duration-300 uppercase tracking-wider ${rating === 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          rating === 4 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            rating === 3 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              rating === 2 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {rating === 5 ? '🤩 Mükemmel' :
                            rating === 4 ? '😊 Çok İyi' :
                              rating === 3 ? '😐 Ortalama' :
                                rating === 2 ? '😕 Kötü' :
                                  '😫 Çok Kötü'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Yorumunuz</label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        className="w-full bg-black/40 border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-white/20 focus:border-white/30 sm:text-sm p-4 transition-all duration-300 resize-none border"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Ürün hakkındaki deneyimlerinizi detaylıca paylaşın..."
                      ></textarea>
                      <div className="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">
                        {comment.length} karakter
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-[0.98] shadow-xl shadow-white/5 hover:shadow-2xl hover:-translate-y-1 my-2"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Gönderiliyor...
                      </span>
                    ) : 'Değerlendirmeyi Gönder'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
