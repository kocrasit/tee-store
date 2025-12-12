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
    <div className="group relative bg-[#FDFBF7] rounded-none border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-96 w-full overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-full object-center object-cover transition-transform duration-700 group-hover:scale-105 saturate-0 group-hover:saturate-100"
        />

        {/* Influencer Badge - Dark Blue */}
        {userRole === 'influencer' && (
          <div className="absolute top-4 right-4 bg-[#172554] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10">
            Influencer
          </div>
        )}

        {/* Quick View Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#172554]/20 z-10">
          <Link
            href={`/design/${id}`}
            className="bg-white text-[#172554] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#172554] hover:text-white transition-colors duration-300"
          >
            İncele
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Category & Author */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e3a8a]">
            {categoryLabels[category] || category}
          </span>
          {uploadedBy && (
            <div className="flex items-center text-[10px] font-medium text-[#1e3a8a]/70 gap-1 uppercase tracking-wider">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">
                {uploadedBy.firstName} {uploadedBy.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-[#172554] line-clamp-1 group-hover:text-[#1e40af] transition-colors">
          <Link href={`/design/${id}`}>{title}</Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center text-[#172554]">
            {[0, 1, 2, 3, 4].map((ratingVal) => (
              <Star
                key={ratingVal}
                className={`h-3 w-3 ${rating > ratingVal ? 'fill-[#172554] text-[#172554]' : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#1e3a8a]/60 ml-1">({reviewsCount})</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xl font-light text-[#172554]">₺{price.toFixed(2)}</p>
          </div>
          <button
            onClick={onAddToCart}
            className="bg-[#172554] text-white p-3 rounded-full hover:bg-[#1e3a8a] transition-colors duration-300"
            aria-label="Sepete Ekle"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
