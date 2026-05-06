"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

type Props = {
  images: string[];
};

const ProductCarousel = ({ images }: Props) => {
  if (!images || images.length === 0) {
    return (
      <div className="h-80 bg-gray-200 flex items-center justify-center mt-24">
        No Images
      </div>
    );
  }

  return (
    <div className="w-full mt-8">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-xl overflow-hidden"
      >

        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-80 md:h-[450px]">
              <Image
                src={img || "/placeholder.png"}
                alt={`slide-${index}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}

      </Swiper>

    </div>
  );
};

export default ProductCarousel;