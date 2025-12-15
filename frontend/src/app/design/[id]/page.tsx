"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Package, ShieldCheck, ShoppingCart, Sparkles, Star, Truck } from "lucide-react";

import api from "@/api/axios";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { getImageUrl } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Siyah", value: "#111827" },
  { name: "Beyaz", value: "#F9FAFB" },
  { name: "Gri", value: "#9CA3AF" },
];

const INFO_TAGS = [
  { icon: Truck, label: "1-3 günde kargoda" },
  { icon: ShieldCheck, label: "Güvenli ödeme" },
  { icon: Package, label: "Kolay iade" },
];

const GUARANTEES = [
  { title: "Ücretsiz İade", desc: "14 gün içinde koşulsuz iade" },
  { title: "Hızlı Kargo", desc: "600+ anlaşmalı teslimat noktası" },
  { title: "Orijinal Tasarım", desc: "Her ürün influencer tasarım onaylı" },
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["design", params.id],
    queryFn: async () => {
      const res = await api.get(`/designs/${params.id}`);
      return res.data;
    },
  });

  const design = data;

  const gallery = useMemo(() => {
    if (!design) return [];
    const arr = [design.images?.preview, design.images?.original].filter(Boolean);
    return arr.length
      ? arr.map((img: string) => getImageUrl(img))
      : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"];
  }, [design]);

  const displayImage = activeImage || gallery[0];

  const hasStock = Number(design?.stock || 0) > 0;
  const ratingValue = typeof design?.rating === "number" ? design.rating : 4.8;

  const handleAddToCart = () => {
    if (!design) return;
    addItem({
      id: design._id,
      title: design.title,
      price: design.price,
      image: displayImage,
      size: selectedSize,
      color: selectedColor.name,
      quantity,
      designId: design._id,
    });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Yorum yapmadan önce giriş yapmalısınız.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/designs/${params.id}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["design", params.id] });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (isError || !design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] text-red-500 font-semibold">
        Ürün yüklenirken bir sorun oluştu.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
          <ArrowLeft className="w-4 h-4" />
          Alışverişe dön
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative rounded-[32px] overflow-hidden bg-white">
              <img
                src={displayImage}
                alt={design.title}
                className="w-full object-cover aspect-[3/4] md:aspect-[4/5]"
              />
              {design.isNewSeason && (
                <span className="absolute top-4 left-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Yeni Sezon
                </span>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 rounded-2xl border-2 flex-shrink-0 overflow-hidden ${
                    displayImage === img ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[28px] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-400 tracking-[0.2em]">{design.category}</p>
                  <h1 className="text-2xl font-black text-[#111] leading-tight mt-1">{design.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span>{ratingValue.toFixed(1)}</span>
                    <span>({design.reviews?.length || 0} yorum)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-gray-400">Fiyat</p>
                  <p className="text-3xl font-black text-[#111]">₺{Number(design.price || 0).toFixed(2)}</p>
                  <p className="text-xs text-emerald-500 font-semibold">{hasStock ? "24 saatte kargoda" : "Tükendi"}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {INFO_TAGS.map((info) => (
                  <div key={info.label} className="bg-gray-50 rounded-2xl py-3 px-3 text-center text-xs font-semibold text-gray-600">
                    <info.icon className="w-4 h-4 mx-auto mb-1 text-black" />
                    {info.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-sm space-y-5">
              <div>
                <p className="text-xs uppercase font-semibold text-gray-400 mb-2">Renk</p>
                <div className="flex gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-11 h-11 rounded-full border-2 transition ${
                        selectedColor.name === color.name ? "border-black scale-105" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase font-semibold text-gray-400">Beden</p>
                  <button className="text-xs text-gray-500 underline">Beden tablosu</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-2xl text-sm font-semibold border transition ${
                        selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-2xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-lg font-bold"
                    disabled={!hasStock}
                  >
                    -
                  </button>
                  <span className="px-6 text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-lg font-bold"
                    disabled={!hasStock}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex-1 bg-black text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2"
                  disabled={!hasStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {GUARANTEES.map((item) => (
            <div key={item.title} className="bg-white rounded-[28px] p-4 shadow-sm">
              <h4 className="text-sm font-bold">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 bg-white rounded-[32px] p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Ürün Açıklaması
          </h3>
          <div className="mt-3 text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: design.description }} />
        </section>

        <section id="reviews" className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-gray-400">Ortalama Puan</p>
                <p className="text-3xl font-black">{ratingValue.toFixed(1)}</p>
                <p className="text-sm text-gray-500">{design.reviews?.length || 0} değerlendirme</p>
              </div>
              <Star className="w-10 h-10 text-amber-400 fill-current" />
            </div>
            <div className="mt-6 space-y-4">
              {(design.reviews || []).slice(0, 4).map((review: any) => (
                <div key={review._id} className="border border-gray-100 rounded-3xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{review.userId?.firstName || "Anonim"}</div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${review.rating >= star ? "text-amber-400 fill-current" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
              {(!design.reviews || design.reviews.length === 0) && (
                <div className="text-center text-sm text-gray-500 font-medium border border-dashed border-gray-200 rounded-3xl p-6">
                  Henüz yorum yapılmadı. İlk yorumu sen bırak!
                </div>
              )}
            </div>
          </div>

          <form onSubmit={submitReview} className="bg-white rounded-[32px] p-6 shadow-sm space-y-4">
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">Ürünü değerlendirin</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}>
                    <Star className={`w-7 h-7 ${rating >= star ? "text-amber-400 fill-current" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-3xl p-4 text-sm resize-none focus:border-black focus:ring-black/5"
              placeholder="Ürünü nasıl bulduğunu anlat..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white rounded-3xl py-3 font-semibold"
            >
              {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
            </button>
          </form>
        </section>
      </div>

      <div className="fixed md:hidden bottom-0 inset-x-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div>
          <p className="text-xs text-gray-400">Toplam</p>
          <p className="text-xl font-black">₺{Number(design.price || 0).toFixed(2)}</p>
        </div>
        <button
          className="flex-1 bg-black text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={!hasStock}
        >
          <ShoppingCart className="w-5 h-5" />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
