"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

type Product = {
  id: string;
  title: string;
  price: number;
  mrp: number;
  images: string[];
  qty: number;
  size?: string;
};

const CheckoutPage = () => {
  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    const data =
      localStorage.getItem(
        "buyNowProduct"
      );

    if (data) {
      setProduct(JSON.parse(data));
    }
  }, []);

  // ================= INPUT =================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= PLACE ORDER =================
  const handlePlaceOrder =
    async () => {
      if (!product) return;

      // LOGIN CHECK
      if (!auth.currentUser) {
        toast.error(
          "Please login first"
        );

        router.push("/login");

        return;
      }

      // VALIDATION
      if (
        !form.name ||
        !form.phone ||
        !form.address ||
        !form.pincode
      ) {
        toast.error(
          "Please fill all details"
        );

        return;
      }

      try {
        setLoading(true);

        const safeProduct = {
          id: product.id || "",
          title:
            product.title || "",
          price:
            product.price || 0,
          mrp:
            product.mrp || 0,
          image:
            product.images?.[0] ||
            "/placeholder.png",
          qty:
            product.qty || 1,
          size:
            product.size || "M",
        };

        const safeCustomer = {
          name: form.name,
          phone: form.phone,
          address: form.address,
          pincode:
            form.pincode,
        };

        const orderData = {
          userId:
            auth.currentUser.uid,

          product: safeProduct,

          customer:
            safeCustomer,

          paymentMethod:
            "COD",

          totalAmount:
            safeProduct.price *
            safeProduct.qty,

          status: "pending",

          createdAt:
            serverTimestamp(),
        };

        const docRef =
          await addDoc(
            collection(
              db,
              "orders"
            ),
            orderData
          );

        // CLEAR STORAGE
        localStorage.removeItem(
          "buyNowProduct"
        );

        toast.success(
          "Order placed successfully"
        );

        router.push(
          `/order-success/${docRef.id}`
        );

      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to place order"
        );
      } finally {
        setLoading(false);
      }
    };

  // ================= NO PRODUCT =================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No product found
      </div>
    );
  }

  const total =
    (product.price || 0) *
    (product.qty || 1);

  const discount =
    (product.mrp || 0) -
    (product.price || 0);

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-5 px-3">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-5">

        {/* ================= LEFT ================= */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">

          <h1 className="text-2xl font-bold mb-5">
            Checkout
          </h1>

          <div className="grid md:grid-cols-2 gap-4">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Enter name"
                className="w-full border border-gray-200 focus:border-black outline-none rounded-xl px-4 py-3"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={
                  handleChange
                }
                placeholder="Enter mobile number"
                className="w-full border border-gray-200 focus:border-black outline-none rounded-xl px-4 py-3"
              />
            </div>

          </div>

          {/* ADDRESS */}
          <div className="mt-4">

            <label className="text-sm font-medium mb-2 block">
              Full Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={
                handleChange
              }
              placeholder="House no, street, landmark..."
              rows={4}
              className="w-full border border-gray-200 focus:border-black outline-none rounded-xl p-4 resize-none"
            />

          </div>

          {/* PINCODE */}
          <div className="mt-4 max-w-[220px]">

            <label className="text-sm font-medium mb-2 block">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={
                handleChange
              }
              placeholder="Pincode"
              className="w-full border border-gray-200 focus:border-black outline-none rounded-xl px-4 py-3"
            />

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white rounded-2xl p-5 shadow-sm h-fit sticky top-5">

          <h2 className="text-xl font-bold mb-5">
            Order Summary
          </h2>

          {/* PRODUCT */}
          <div className="flex gap-4 border-b pb-5">

            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">

              <Image
                src={
                  product.images?.[0] ||
                  "/placeholder.png"
                }
                alt={product.title}
                fill
                className="object-cover"
              />

            </div>

            <div className="flex-1 min-w-0">

              <h3 className="font-medium line-clamp-2">
                {product.title}
              </h3>

              <div className="flex items-center gap-2 mt-2">

                <span className="font-bold text-lg">
                  ₹{product.price}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>

              </div>

              <div className="flex gap-3 text-sm text-gray-500 mt-2">

                <span>
                  Size:{" "}
                  {product.size ||
                    "M"}
                </span>

                <span>
                  Qty:{" "}
                  {product.qty || 1}
                </span>

              </div>

            </div>

          </div>

          {/* PRICE DETAILS */}
          <div className="space-y-3 py-5 border-b">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span>
                ₹{total}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Discount
              </span>

              <span className="text-green-600">
                -₹{discount}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Delivery
              </span>

              <span className="text-green-600">
                FREE
              </span>
            </div>

          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center py-5">

            <span className="text-lg font-bold">
              Total
            </span>

            <span className="text-2xl font-bold">
              ₹{total}
            </span>

          </div>

          {/* COD */}
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 mb-5">
            Cash on Delivery Available
          </div>

          {/* TERMS */}
          <div className="mb-5">

            <label className="flex items-start gap-3 cursor-pointer">

              <input
                type="checkbox"
                required
                className="mt-1 accent-black"
              />

              <p className="text-xs text-gray-500 leading-5">

                I agree to the{" "}

                <Link
                  href="/terms-and-conditions"
                  className="underline text-black"
                >
                  Terms & Conditions
                </Link>

                {" "}and{" "}

                <Link
                  href="/return-refund-policy"
                  className="underline text-black"
                >
                  Return & Refund Policy
                </Link>.

              </p>

            </label>

          </div>

          {/* BUTTON */}
          <button
            onClick={
              handlePlaceOrder
            }
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;