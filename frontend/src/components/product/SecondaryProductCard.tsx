import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

interface SecondaryProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

export default function SecondaryProductCard({
    id,
    title,
    price,
    image,
    category,
}: SecondaryProductCardProps) {
    return (
        <div className="group relative block bg-white rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full">
            {/* Image Container */}
            <div className="relative h-[360px] sm:h-[500px] overflow-hidden bg-gray-100">
                <Link href={`/design/${id}`}>
                    <img
                        src={getImageUrl(image)}
                        alt={title}
                        onError={(event) => {
                            event.currentTarget.src = '/placeholder.jpg';
                        }}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                </Link>
                <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-black bg-white/90 backdrop-blur-sm rounded-full uppercase shadow-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content Overlay - Positioned Absolute at Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <Link href={`/design/${id}`} className="block">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                            {title}
                        </h3>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <p className="text-xl font-medium">
                            {Number(price || 0).toFixed(2)} ₺
                        </p>

                        <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-white transition-colors w-full sm:w-auto">
                            İncele
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
