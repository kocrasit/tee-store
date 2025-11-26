import React from 'react';
import Link from 'next/link';
import { Star, User } from 'lucide-react';

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
    <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-96 relative h-80 w-full">
        <img
          src={image.startsWith('http') ? image : `http://127.0.0.1:5000${image}`}
          alt={title}
          className="w-full h-full object-center object-cover"
        />
        {userRole === 'influencer' && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Influencer
          </div>
        )}
      </div>
      <div className="flex-1 p-4 space-y-2 flex flex-col">
        <h3 className="text-sm font-medium text-indigo-600">
          {categoryLabels[category] || category}
        </h3>
        <h3 className="text-xl font-semibold text-gray-900">
          <Link href={`/design/${id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        {uploadedBy && (
          <div className="flex items-center text-xs text-gray-500">
            <User className="w-3 h-3 mr-1" />
            {uploadedBy.firstName} {uploadedBy.lastName}
          </div>
        )}
        <div className="flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((ratingVal) => (
              <Star
                key={ratingVal}
                className={`h-4 w-4 ${rating > ratingVal ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">{reviewsCount} yorum</span>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-lg font-medium text-gray-900">₺{price.toFixed(2)}</p>
        </div>
        <button className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-10 relative">
          Sepete Ekle
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
