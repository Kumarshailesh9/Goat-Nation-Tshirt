"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    setProducts(data);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <div className="bg-white rounded-xl shadow p-4">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between border-b py-4"
            >
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p>₹{product.price}</p>
                <p>{product.category}</p>
              </div>

              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}