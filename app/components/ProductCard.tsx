"use client";

import Link from "next/link";
import Image from "next/image";

import { Heart } from "lucide-react";

import { useWishlist } from "@/app/hooks/useWishlist";

interface ProductProps {
  product: any;
}

export default function ProductCard({
  product,
}: ProductProps) {
  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist(product.id);

  return (
    <div className="border rounded-2xl overflow-hidden bg-white relative group">
      {/* Wishlist Button */}
      <button
        onClick={() =>
          toggleWishlist(product)
        }
        className="absolute top-3 right-3 z-10 bg-white shadow-md p-2 rounded-full"
      >
        <Heart
          className={`w-5 h-5 transition ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-500"
          }`}
        />
      </button>

      {/* Product Link */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <div className="p-4">
          <h2 className="font-medium line-clamp-2">
            {product.title}
          </h2>

          <p className="mt-2 text-lg font-bold">
            ₹{product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}