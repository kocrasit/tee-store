import React from 'react';
import Link from 'next/link';
import { Star, User, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  userRole?: 'influencer' | 'designer';
  uploadedBy?: {
    firstName: string;
    lastName: string;
  };
  onAddToCart?: () => void;
}

const categoryLabels: Record<string, string> = {
  tshirt: 'T-Shirt',
  hoodie: 'Hoodie',
  sweatshirt: 'Sweatshirt',
  mug: 'Kupa',
  poster: 'Poster',
  sticker: 'Sticker',
};

export function ProductCard({
  id,
  title,
  price,
  image,
  category,
  rating,
  reviewsCount,
  userRole,
  uploadedBy,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/design/${id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {userRole === 'influencer' && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white bg-black/70 rounded-full px-3 py-1">
              Influencer
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-gray-400">
          <span>{categoryLabels[category] || category}</span>
          {uploadedBy && (
            <span className="line-clamp-1">
              {uploadedBy.firstName} {uploadedBy.lastName}
            </span>
          )}
        </div>
        <Link href={`/design/${id}`} className="text-sm font-semibold line-clamp-2 text-gray-900">
          {title}
        </Link>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          {[0, 1, 2, 3, 4].map((ratingVal) => (
            <Star
              key={ratingVal}
              className={`h-3 w-3 ${rating > ratingVal ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
            />
          ))}
          <span>({reviewsCount})</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-gray-900">₺{price.toFixed(2)}</p>
          <button
            onClick={onAddToCart}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black text-black hover:bg-black hover:text-white transition"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

