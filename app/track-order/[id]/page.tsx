"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const steps = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
];

const labels: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Order Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function TrackOrderPage() {

  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH ORDER =================
  useEffect(() => {

    const fetchOrder =
      async () => {

        try {

          const snap =
            await getDoc(
              doc(
                db,
                "orders",
                id
              )
            );

          if (snap.exists()) {
            setOrder(snap.data());
          }

        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchOrder();
    }

  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">

          <h1 className="text-2xl font-bold mb-2">
            Order Not Found
          </h1>

          <p className="text-gray-500">
            This order does not exist
          </p>

        </div>

      </div>
    );
  }

  const currentStatus =
    order.status || "pending";

  const currentStepIndex =
    steps.indexOf(currentStatus);

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b">

          <h1 className="text-2xl md:text-3xl font-bold">
            Track Your Order
          </h1>

          <p className="text-gray-500 mt-1">
            Order ID: {id}
          </p>

        </div>

        {/* PRODUCT */}
        <div className="p-6 border-b">

          <div className="flex gap-5">

            <img
              src={
                order.product?.image ||
                "/placeholder.png"
              }
              alt="product"
              className="w-28 h-28 object-cover rounded-2xl border bg-gray-100"
            />

            <div className="flex-1">

              <h2 className="text-lg font-semibold line-clamp-2">
                {order.product?.title}
              </h2>

              <div className="flex gap-4 mt-3 text-sm text-gray-500">

                <span>
                  Qty:{" "}
                  {order.product?.qty ||
                    1}
                </span>

                <span>
                  Size:{" "}
                  {order.product?.size ||
                    "M"}
                </span>

              </div>

              <p className="text-2xl font-bold mt-4">
                ₹
                {order.totalAmount}
              </p>

            </div>

          </div>

        </div>

        {/* TRACKING */}
        <div className="p-6">

          <h3 className="text-xl font-semibold mb-8">
            Order Status
          </h3>

          <div className="space-y-8">

            {steps.map(
              (step, index) => {

                const isCompleted =
                  index <=
                  currentStepIndex;

                const isLast =
                  index ===
                  steps.length - 1;

                return (
                  <div
                    key={step}
                    className="flex gap-5"
                  >

                    {/* LEFT */}
                    <div className="flex flex-col items-center">

                      <div
                        className={`w-6 h-6 rounded-full border-[5px] ${
                          isCompleted
                            ? "bg-black border-black"
                            : "bg-white border-gray-300"
                        }`}
                      />

                      {!isLast && (
                        <div
                          className={`w-[2px] h-16 ${
                            isCompleted
                              ? "bg-black"
                              : "bg-gray-300"
                          }`}
                        />
                      )}

                    </div>

                    {/* RIGHT */}
                    <div className="pt-0.5">

                      <h4
                        className={`font-semibold text-lg ${
                          isCompleted
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {labels[step]}
                      </h4>

                      <p
                        className={`text-sm mt-1 ${
                          isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {isCompleted
                          ? "Completed"
                          : "Waiting"}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* STATUS */}
          <div className="mt-10 flex justify-center">

            <span className="bg-black text-white px-6 py-3 rounded-full capitalize text-sm font-medium">
              Current Status:{" "}
              {currentStatus}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}