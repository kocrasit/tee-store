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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">Ürün yüklenirken bir hata oluştu.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Alışverişe Dön
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    onClick={() => setActiveImage(img)}
                  >
                    <span className="sr-only">Image {idx + 1}</span>
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-center object-cover" />
                    </span>
                    <span className={`absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none ${activeImage === img ? 'ring-indigo-500' : 'ring-transparent'}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 sm:aspect-w-4 sm:aspect-h-3 lg:aspect-none lg:h-[600px]">
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-center object-cover sm:rounded-lg"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="mb-4">
              <span className="text-indigo-600 font-medium">{product.category}</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.title}</h1>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">₺{product.price.toFixed(2)}</p>
            </div>

            {/* Reviews Summary */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {product.reviewsCount} değerlendirme
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <form className="mt-6">
              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Stokta Var ({product.stock} adet)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Tükendi
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="mt-4">
                <h3 className="text-sm text-gray-900 font-medium">Renk</h3>
                <div className="mt-2 flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer focus:outline-none ${color.class} ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ' + color.selectedClass : ''}`}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-gray-900 font-medium">Beden</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Beden Tablosu
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none ${selectedSize === size ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                  >-</button>
                  <input
                    type="number"
                    className="w-full text-center border-none focus:ring-0 p-0 text-gray-900"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                  >+</button>
                </div>
                <button
                  type="submit"
                  disabled={product.stock <= 0}
                  className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock > 0 ? 'Sepete Ekle' : 'Tükendi'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 border-t border-gray-200 pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <p className="ml-3 text-sm text-gray-500">Güvenli Ödeme & %100 Müşteri Memnuniyeti</p>
                </div>
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <p className="ml-3 text-sm text-gray-500">Hızlı Kargo & Kolay İade</p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Müşteri Değerlendirmeleri</h2>
              <p className="mt-2 text-gray-500">Bu ürün hakkında yapılan son yorumlar</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-indigo-600 fill-current" />
              <span className="font-bold text-indigo-900">{product.rating.toFixed(1)}</span>
              <span className="text-indigo-600">/ 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Henüz değerlendirme yapılmamış.</p>
                  <p className="text-sm text-gray-400">İlk değerlendiren siz olun ve deneyiminizi paylaşın!</p>
                </div>
              ) : (
                product.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                          {review.userId?.firstName ? review.userId.firstName.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 font-medium">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Değerlendirme Yap</h3>
                <p className="text-gray-500 text-sm mb-6">Ürünü satın aldınız mı? Deneyiminizi paylaşın.</p>

                <form onSubmit={submitReview} className="relative">
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-900 mb-4">Puanınız</label>
                    <div className="flex flex-col gap-3">
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
                                ? 'text-yellow-400 fill-current drop-shadow-md'
                                : 'text-gray-200 group-hover:text-yellow-200'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="h-6">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full transition-all duration-300 ${rating === 5 ? 'bg-green-100 text-green-700' :
                          rating === 4 ? 'bg-blue-100 text-blue-700' :
                            rating === 3 ? 'bg-yellow-100 text-yellow-700' :
                              rating === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
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
                    <label className="block text-sm font-bold text-gray-900 mb-3">Yorumunuz</label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        className="w-full border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 sm:text-sm p-5 bg-gray-50 hover:bg-white transition-all duration-300 resize-none placeholder-gray-400"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Ürün hakkındaki deneyimlerinizi detaylıca paylaşın..."
                      ></textarea>
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                        {comment.length} karakter
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-[0.98] shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1"
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

