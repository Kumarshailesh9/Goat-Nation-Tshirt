"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  product: {
    title: string;
    image: string;
    price: number;
    qty: number;
    size?: string;
  };
  totalAmount: number;
  status: string;
  createdAt?: any;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        // 🔥 FETCH ONLY USER ORDERS
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(data.reverse());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow-sm border"
            >

              {/* TOP */}
              <div className="flex justify-between mb-3">
                <p className="text-xs text-gray-500">
                  Order ID: {order.id}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* PRODUCT */}
              <div className="flex gap-4">

                <img
                  src={order.product?.image || "/placeholder.png"}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-medium">
                    {order.product?.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Size: {order.product?.size || "M"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {order.product?.qty}
                  </p>

                  <p className="font-semibold mt-1">
                    ₹{order.totalAmount}
                  </p>
                </div>

              </div>

              {/* ACTION */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    router.push(`/track-order?id=${order.id}`)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  Track Order →
                </button>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}