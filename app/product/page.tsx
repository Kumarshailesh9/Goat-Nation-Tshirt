"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ✅ Product type
type Product = {
  id: string;
  image: string;
  title: string;
  price: number;
  mrp: number;
};

const Product = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const ITEMS_PER_PAGE = 4;

  // ✅ FETCH FROM FIREBASE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const data: Product[] = snapshot.docs.map((doc) => {
          const item: any = doc.data();

          return {
            id: doc.id,
            title: item.name,
            image: item.images?.[0],
            price: item.price,
            mrp: item.mrp || item.price,
          };
        });

        setAllProducts(data);
        setVisibleProducts(data.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ✅ LOAD MORE
  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const newItems = allProducts.slice(start, start + ITEMS_PER_PAGE);

    setVisibleProducts((prev) => [...prev, ...newItems]);
    setPage(nextPage);
  };

  // ✅ BUY NOW FUNCTION
  const handleBuyNow = (product: Product) => {
    const buyNowData = {
      ...product,
      qty: 1,
    };

    localStorage.setItem("buyNowProduct", JSON.stringify(buyNowData));

    router.push("/checkout");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* PRODUCT GRID */}
      <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {visibleProducts.map((p) => (
          <li key={p.id}>
            <Link href={`/product/${p.id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer">

                {/* IMAGE */}
                <div className="relative bg-gray-100 aspect-square overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* INFO */}
                <div className="p-3 space-y-1">

                  <h2 className="text-sm font-medium line-clamp-2">
                    {p.title}
                  </h2>

                  {/* PRICE */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">
                      ₹{p.price}
                    </span>

                    <span className="text-gray-400 line-through text-sm">
                      ₹{p.mrp}
                    </span>

                    <span className="text-green-600 text-sm">
                      {Math.round(
                        ((p.mrp - p.price) / p.mrp) * 100
                      )}
                      % OFF
                    </span>
                  </div>

                  {/* BUY NOW BUTTON */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleBuyNow(p);
                    }}
                    className="w-full mt-2 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                  >
                    Buy Now
                  </button>

                </div>
              </div>
            </Link>
          </li>
        ))}

      </ul>

      {/* LOAD MORE */}
      {visibleProducts.length < allProducts.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;