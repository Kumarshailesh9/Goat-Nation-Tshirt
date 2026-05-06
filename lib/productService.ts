"use client";

import { db, storage } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "@/types/product";

// Upload image
export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Add product
export const addProduct = async (product: Product) => {
  await addDoc(collection(db, "products"), product);
};

// Get products
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">)
  }));
};