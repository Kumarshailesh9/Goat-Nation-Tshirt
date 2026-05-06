"use client";

import { useEffect, useState } from "react";
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("buyNowProduct");

    if (data) {
      setProduct(JSON.parse(data));
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 FINAL ORDER SAVE
  const handlePlaceOrder = async () => {
    if (!product) return;

    // 🔐 LOGIN CHECK
    if (!auth.currentUser) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    // 📝 VALIDATION
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      toast.error("Please fill all details");
      return;
    }

    try {
      setLoading(true);

      // ✅ SAFE PRODUCT
      const safeProduct = {
        id: product.id || "",
        title: product.title || "",
        price: product.price || 0,
        mrp: product.mrp || 0,
        image: product.images?.[0] || "/placeholder.png",
        qty: product.qty || 1,
        size: product.size || "M",
      };

      // ✅ SAFE CUSTOMER
      const safeCustomer = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
      };

      // 🔥 FINAL ORDER OBJECT
      const orderData = {
        userId: auth.currentUser.uid, // ✅ IMPORTANT

        product: safeProduct,
        customer: safeCustomer,

        paymentMethod: "COD",
        totalAmount: safeProduct.price * safeProduct.qty,

        status: "pending",
        createdAt: serverTimestamp(),
      };

      console.log("Saving Order:", orderData);

      const docRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      // 🧹 CLEAR DATA
      localStorage.removeItem("buyNowProduct");

      // 🚀 REDIRECT
      router.push(`/order-success/${docRef.id}`);

    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        No product found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT - FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

          <h2 className="text-xl font-semibold mb-4">
            Shipping Details
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

          <h2 className="text-xl font-semibold">
            Order Summary
          </h2>

          {/* PRODUCT */}
          <div className="flex gap-4 border-b pb-4">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt="product"
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div>
              <h3 className="font-medium">{product.title}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size || "M"}
              </p>
              <p className="text-sm text-gray-500">
                Qty: {product.qty || 1}
              </p>
            </div>
          </div>

          {/* PRICE */}
          <div className="space-y-2">

            <div className="flex justify-between">
              <span>Price</span>
              <span>₹{product.price}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">
                -₹{(product.mrp || 0) - (product.price || 0)}
              </span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>
                ₹{(product.price || 0) * (product.qty || 1)}
              </span>
            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Cash on Delivery (COD)
          </p>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;