"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const steps = ["pending", "confirmed", "shipped", "delivered"];

const labels: any = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function TrackOrderPage() {
  const params = useSearchParams();
  const orderId = params.get("id");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      const snap = await getDoc(doc(db, "orders", orderId));

      if (snap.exists()) {
        setOrder(snap.data());
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-semibold mb-6">
          Track Order
        </h1>

        {/* PRODUCT */}
        <div className="flex gap-4 mb-6 border-b pb-4">
          <img
            src={order.product?.image}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-medium">
              {order.product?.title}
            </h2>
            <p className="text-sm text-gray-500">
              Qty: {order.product?.qty}
            </p>
            <p className="font-semibold">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="relative">

          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;

            return (
              <div key={step} className="flex items-start gap-4 mb-6">

                {/* DOT + LINE */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isActive ? "bg-black" : "bg-gray-300"
                    }`}
                  />

                  {index !== steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        index < currentStepIndex
                          ? "bg-black"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                {/* TEXT */}
                <div>
                  <p
                    className={`font-medium ${
                      isActive ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {labels[step]}
                  </p>

                  <p className="text-xs text-gray-400">
                    {isActive
                      ? "Completed"
                      : "Waiting"}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

        {/* STATUS BADGE */}
        <div className="mt-6 text-center">
          <span className="px-4 py-2 bg-black text-white rounded-full text-sm capitalize">
            {order.status}
          </span>
        </div>

      </div>

    </div>
  );
}