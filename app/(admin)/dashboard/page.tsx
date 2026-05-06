"use client";

import Link from "next/link";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";

export default function DashboardPage() {
   
  const cards = [
    { title: "Add Product", path: "/dashboard/add-product" },
    { title: "Manage Products", path: "/dashboard/products" },
    { title: "Orders", path: "/dashboard/orders" },
  ];
   const { loading } = useAdminAuth();
   if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking access...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.path}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}