"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import toast from "react-hot-toast";

import { db } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";

export function useWishlist(productId?: string) {
  const { user } = useAuth();

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && productId) {
      checkWishlist();
    }
  }, [user, productId]);

  const checkWishlist = async () => {
    const q = query(
      collection(db, "wishlist"),
      where("userId", "==", user?.uid),
      where("productId", "==", productId)
    );

    const snapshot = await getDocs(q);

    setIsWishlisted(!snapshot.empty);
  };

  const toggleWishlist = async (
    product: any
  ) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(
          doc(
            db,
            "wishlist",
            snapshot.docs[0].id
          )
        );

        setIsWishlisted(false);

        toast.success(
          "Removed from wishlist"
        );
      } else {
        await addDoc(
  collection(db, "wishlist"),
  {
    userId: user.uid,
    productId: product.id,
    title: product.title,
    image: product.images?.[0] || "",
    price: product.price,
    createdAt: new Date(),
  }
);

        setIsWishlisted(true);

        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    isWishlisted,
    toggleWishlist,
    loading,
  };
}