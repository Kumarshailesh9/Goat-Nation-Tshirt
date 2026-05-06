"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic"; // ✅ important

const OrderSuccessPage = () => {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const id = searchParams.get("orderId");
        setOrderId(id);
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

            <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md w-full">

                {/* SUCCESS ICON */}
                <div className="text-green-600 text-5xl mb-4">
                    ✓
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-600 mb-4">
                    Thank you for your purchase 🎉
                </p>

                {/* ORDER ID */}
                {orderId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Order ID: <span className="font-medium">{orderId}</span>
                    </p>
                )}

                <Link
                    href="/track-order"
                    className="block mt-4 text-blue-600 underline"
                >
                    Track your order
                </Link>

                <Link
                    href="/"
                    className="bg-black text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-800 transition"
                >
                    Continue Shopping
                </Link>

            </div>
        </div>
    );
};

export default OrderSuccessPage;