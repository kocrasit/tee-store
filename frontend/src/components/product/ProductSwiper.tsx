'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSwiperProps {
    products: any[];
}

export default function ProductSwiper({ products }: ProductSwiperProps) {
    return (
        <div className="product-swiper-container pb-12">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
                className="!pb-12 !px-2"
            >
                {products.map((design: any) => (
                    <SwiperSlide key={design._id} className="h-auto">
                        <ProductCard
                            id={design._id}
                            title={design.title}
                            price={design.price}
                            image={design.images?.preview}
                            category={design.category}
                            rating={typeof design.rating === "number" ? design.rating : 0}
                            reviewsCount={Array.isArray(design.reviews) ? design.reviews.length : 0}
                            userRole={design.userRole}
                            uploadedBy={design.uploadedBy}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles for Swiper Navigation if needed, typically global styles or CSS modules are better, 
          but here we rely on default Swiper styles which are usually sufficient or overridden in globals.css 
      */}
        </div>
    );
}
