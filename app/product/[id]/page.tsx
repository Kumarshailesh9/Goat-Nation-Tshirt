"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { Heart } from "lucide-react";

import { db } from "@/lib/firebase";
import { useWishlist } from "@/app/hooks/useWishlist";

type Product = {
  id: string;
  title: string;
  price: number;
  mrp: number;
  images: string[];
  description?: string;
  highlights?: Record<string, string>;
  sizeStock?: { size: string; qty: number }[];
  createdAt?: any;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const thumbRef = useRef<HTMLDivElement | null>(null);

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist(id as string);

  // ================= FETCH =================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const ref = doc(db, "products", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data: any = snap.data();

        const formatted: Product = {
          id: snap.id,
          title: data.name,
          price: Number(data.price),
          mrp: Number(data.mrp),
          images: data.images || [],
          description: data.description || "",
          highlights: data.highlights || {},
          sizeStock: data.sizeStock || [],
          createdAt: data.createdAt || null,
        };

        setProduct(formatted);
        setSelectedImage(formatted.images?.[0] || "");
      }
    };

    fetchProduct();
  }, [id]);

  // ================= BUY =================
  const handleBuyNow = () => {
    if (!product || !selectedSize) return;

    const buyNowData = {
      ...product,
      qty: 1,
      size: selectedSize,
    };

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(buyNowData)
    );

    router.push("/checkout");
  };

  // ================= THUMB SCROLL =================
  const scrollThumbLeft = () => {
    thumbRef.current?.scrollBy({
      left: -120,
      behavior: "smooth",
    });
  };

  const scrollThumbRight = () => {
    thumbRef.current?.scrollBy({
      left: 120,
      behavior: "smooth",
    });
  };

  // ================= IMAGE NAV =================
  const nextImage = () => {
    if (!product) return;

    const i =
      product.images.indexOf(selectedImage);

    setSelectedImage(
      product.images[
        (i + 1) % product.images.length
      ]
    );
  };

  const prevImage = () => {
    if (!product) return;

    const i =
      product.images.indexOf(selectedImage);

    setSelectedImage(
      product.images[
        (i - 1 + product.images.length) %
          product.images.length
      ]
    );
  };

  // ================= SWIPE =================
  let touchStartX = 0;

  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (
    e: React.TouchEvent
  ) => {
    const endX =
      e.changedTouches[0].clientX;

    if (touchStartX - endX > 50)
      nextImage();

    if (endX - touchStartX > 50)
      prevImage();
  };

  if (!product) {
    return (
      <div className="p-6 text-center">
        Loading...
      </div>
    );
  }

  const discount = Math.round(
    ((product.mrp - product.price) /
      product.mrp) *
      100
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto md:p-6 grid md:grid-cols-2 gap-6">
        
        {/* ================= LEFT - GALLERY ================= */}
        <div className="bg-white md:rounded-xl md:p-4">

          {/* MAIN IMAGE */}
          <div
            className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover"
            />

            {/* WISHLIST BUTTON */}
            <button
              onClick={() =>
                toggleWishlist(product)
              }
              className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-700"
                }`}
              />
            </button>

            {/* LEFT ARROW */}
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow"
            >
              ◀
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow"
            >
              ▶
            </button>
          </div>

          {/* THUMBNAILS */}
          <div className="relative mt-4">

            <button
              onClick={scrollThumbLeft}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-full"
            >
              ◀
            </button>

            <div
              ref={thumbRef}
              className="flex gap-3 overflow-x-auto px-6 scroll-smooth"
            >
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setSelectedImage(img)
                  }
                  className={`relative min-w-[70px] h-[70px] border-2 rounded-lg cursor-pointer transition ${
                    selectedImage === img
                      ? "border-black scale-105"
                      : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={scrollThumbRight}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-full"
            >
              ▶
            </button>

          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-4 md:rounded-xl space-y-5">

          <h1 className="text-lg md:text-2xl font-semibold">
            {product.title}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-xl md:text-3xl font-bold">
              ₹{product.price}
            </span>

            <span className="line-through text-gray-400">
              ₹{product.mrp}
            </span>

            <span className="text-green-600 font-medium">
              {discount}% OFF
            </span>
          </div>

          {product.createdAt && (
            <p className="text-xs text-gray-500">
              Added on:{" "}
              {new Date(
                product.createdAt.seconds *
                  1000
              ).toLocaleDateString()}
            </p>
          )}

          {/* SIZE */}
          <div>
            <p className="text-sm mb-2 font-medium">
              Select Size
            </p>

            <div className="flex gap-2 flex-wrap">
              {product.sizeStock?.map(
                (item) => (
                  <button
                    key={item.size}
                    disabled={
                      item.qty === 0
                    }
                    onClick={() =>
                      setSelectedSize(
                        item.size
                      )
                    }
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize ===
                      item.size
                        ? "bg-black text-white"
                        : "bg-white"
                    } ${
                      item.qty === 0 &&
                      "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {item.size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div>
            <h3 className="font-semibold mb-3">
              Highlights
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(
                product.highlights || {}
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b pb-2"
                >
                  <span className="text-gray-500">
                    {key}
                  </span>

                  <span className="font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold mb-2">
              Product Details
            </h3>

            <p className="text-gray-600 text-sm leading-6">
              {product.description ||
                "No description available"}
            </p>
          </div>

          {/* DESKTOP BUTTON */}
          <div className="hidden md:block">
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50 hover:bg-gray-900 transition"
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden">
        <button
          onClick={handleBuyNow}
          disabled={!selectedSize}
          className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}