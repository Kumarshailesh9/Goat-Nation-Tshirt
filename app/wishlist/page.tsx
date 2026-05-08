"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { db } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";

interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  image?: string;
  price: number;
}

export default function WishlistPage() {
  const { user } = useAuth();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user?.uid)
      );

      const snapshot = await getDocs(q);

      const data: WishlistItem[] = snapshot.docs.map((docItem) => {
        const item = docItem.data();

        return {
          id: docItem.id,
          productId: item.productId || "",
          title: item.title || "Product",
          image: item.image || "",
          price: item.price || 0,
        };
      });

      setItems(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (id: string) => {
    try {
      await deleteDoc(doc(db, "wishlist", id));

      setItems((prev) => prev.filter((item) => item.id !== id));

      toast.success("Removed from wishlist");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-5">
        <div className="max-w-6xl mx-auto">

          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-3 flex gap-3 animate-pulse"
              >
                <div className="w-28 h-28 bg-gray-200 rounded-xl" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // EMPTY UI
  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-sm border">

          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Wishlist Empty
          </h2>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Save products you love and shop later.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-900">
            My Wishlist
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {items.length} saved items
          </p>

        </div>

        {/* PRODUCT LIST */}
        <div className="space-y-4">

          {items.map((item) => {

            const safeImage =
              typeof item.image === "string" &&
              item.image.startsWith("http")
                ? item.image
                : "/placeholder.png";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border hover:shadow-md transition"
              >

                <div className="flex flex-col sm:flex-row">

                  {/* IMAGE */}
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative w-full sm:w-52 aspect-square bg-gray-100 overflow-hidden"
                  >

                    {safeImage ? (
                      <Image
                        src={safeImage}
                        alt={item.title || "Product"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <img
                        src="/placeholder.png"
                        alt="placeholder"
                        className="w-full h-full object-cover"
                      />
                    )}

                  </Link>

                  {/* CONTENT */}
                  <div className="flex-1 p-4 flex flex-col justify-between">

                    <div>

                      <Link href={`/product/${item.productId}`}>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-black transition">
                          {item.title}
                        </h2>
                      </Link>

                      <p className="text-2xl font-bold text-black mt-3">
                        ₹{item.price}
                      </p>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 mt-5">

                      <Link
                        href={`/product/${item.productId}`}
                        className="flex-1 bg-black text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeWishlist(item.id)}
                        className="w-12 h-12 rounded-xl border flex items-center justify-center hover:bg-red-50 transition"
                      >
                        <Trash2
                          size={18}
                          className="text-red-500"
                        />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}