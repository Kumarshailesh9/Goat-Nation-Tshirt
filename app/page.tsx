"use client";

import Product from "./product/page";
import ProductCarousel from "./components/ProductCarousel";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white">

      {/* 🔥 HERO SECTION */}
      <section className="relative">

        <ProductCarousel
          images={[
            "/banner1.png",
            "/banner2.png",
            "/banner3.jpg",
          ]}
        />

        {/* OVERLAY TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Wear The Legacy
          </h1>

          <p className="mb-6 text-sm md:text-lg">
            Premium Streetwear for the Bold
          </p>

          <Link
            href="/product"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>

      </section>

      {/* 🔥 FEATURED PRODUCTS */}
      <section className="py-4 md:px-20">

        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Featured Collection
        </h2>

        <Product />

      </section>

      {/* 🔥 ABOUT */}
      <AboutSection />

      {/* 🔥 FOOTER */}
      <Footer />

    </main>
  );
}