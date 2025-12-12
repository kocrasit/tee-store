import React from 'react';
import Link from 'next/link';
import { Star, User, ShoppingCart } from 'lucide-react';

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
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, category, rating, reviewsCount, userRole, uploadedBy }) => {
  const categoryLabels: Record<string, string> = {
    'tshirt': 'T-Shirt',
    'hoodie': 'Hoodie',
    'sweatshirt': 'Sweatshirt',
    'mug': 'Kupa',
    'poster': 'Poster',
    'sticker': 'Sticker',
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-fade-in-up">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50">
        <img
          src={image.startsWith('http') ? image : `http://127.0.0.1:5000${image}`}
          alt={title}
          className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Influencer Badge */}
        {userRole === 'influencer' && (
          <div className="absolute top-3 right-3 glass-card px-3 py-1.5 rounded-full backdrop-blur-md z-10">
            <span className="text-xs font-bold gradient-text-neon">✨ Influencer</span>
          </div>
        )}

        {/* Quick View Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <Link
            href={`/design/${id}`}
            className="btn-gradient transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            Hızlı Görüntüle
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider gradient-text">
            {categoryLabels[category] || category}
          </span>
          {uploadedBy && (
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{uploadedBy.firstName} {uploadedBy.lastName}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-primary-600 transition-colors duration-300">
          <Link href={`/design/${id}`}>
            {title}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((ratingVal) => (
              <Star
                key={ratingVal}
                className={`h-4 w-4 transition-colors ${rating > ratingVal
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewsCount})</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold gradient-text">₺{price.toFixed(2)}</p>
          </div>
          <button
            className="group/btn relative bg-gradient-to-r from-primary-600 to-accent-600 text-white p-3 rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-110 overflow-hidden"
            aria-label="Sepete Ekle"
          >
            {/* Ripple effect background */}
            <span className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 transition-transform duration-500 rounded-full" />
            <ShoppingCart className="h-5 w-5 relative z-10" />
          </button>
        </div>
      </div>

      {/* Decorative glow effect */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default ProductCard;
