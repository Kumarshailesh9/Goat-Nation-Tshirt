// "use client";

// import { useEffect, useState } from "react";
// import {
//   collection,
//   onSnapshot,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAdminAuth } from "@/app/hooks/useAdminAuth";

// interface Order {
//   id: string;
//   product: {
//     title: string;
//     image: string;
//     price: number;
//     qty: number;
//     size?: string;
//   };
//   customer: {
//     name: string;
//     phone: string;
//     address: string;
//     pincode: string;
//   };
//   totalAmount: number;
//   status: string;
//   createdAt?: any;
// }

// export default function OrdersPage() {
//   const { loading } = useAdminAuth();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   // 🔥 REAL-TIME FIREBASE
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
//       const data = snapshot.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       })) as Order[];

//       setOrders(data.reverse());
//     });

//     return () => unsubscribe();
//   }, []);

//   // 🔍 FILTER + SEARCH
//   const filteredOrders = orders.filter((order) => {
//     const matchSearch =
//       order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
//       order.product.title.toLowerCase().includes(search.toLowerCase());

//     const matchFilter =
//       filter === "all" ? true : order.status === filter;

//     return matchSearch && matchFilter;
//   });

//   // 🔥 UPDATE STATUS
//   const updateStatus = async (id: string, status: string) => {
//     try {
//       await updateDoc(doc(db, "orders", id), { status });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Checking admin access...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

//         <h1 className="text-2xl font-bold">
//           Orders Dashboard
//         </h1>

//         <div className="flex gap-3">

//           {/* SEARCH */}
//           <input
//             type="text"
//             placeholder="Search by name or product..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border px-4 py-2 rounded-lg text-sm w-60"
//           />

//           {/* FILTER */}
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border px-3 py-2 rounded-lg text-sm"
//           >
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="shipped">Shipped</option>
//             <option value="delivered">Delivered</option>
//           </select>

//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">

//         <table className="w-full text-sm">

//           <thead className="bg-gray-50 text-gray-600 text-left">
//             <tr>
//               <th className="p-4">Product</th>
//               <th>Customer</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Update</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr
//                 key={order.id}
//                 className="border-t hover:bg-gray-50"
//               >
//                 {/* PRODUCT */}
//                 <td className="p-4 flex gap-3 items-center">
//                   <img
//                     src={order.product?.image || "/placeholder.png"}
//                     className="w-14 h-14 rounded object-cover"
//                   />
//                   <div>
//                     <p className="font-medium">
//                       {order.product?.title}
//                     </p>
//                     <p className="text-gray-500 text-xs">
//                       Qty: {order.product?.qty}
//                     </p>
//                   </div>
//                 </td>

//                 {/* CUSTOMER */}
//                 <td>
//                   <p className="font-medium">
//                     {order.customer?.name}
//                   </p>
//                   <p className="text-gray-500 text-xs">
//                     {order.customer?.phone}
//                   </p>
//                 </td>

//                 {/* AMOUNT */}
//                 <td className="font-semibold">
//                   ₹{order.totalAmount}
//                 </td>

//                 {/* STATUS BADGE */}
//                 <td>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium
//                       ${
//                         order.status === "pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : order.status === "confirmed"
//                           ? "bg-blue-100 text-blue-700"
//                           : order.status === "shipped"
//                           ? "bg-purple-100 text-purple-700"
//                           : "bg-green-100 text-green-700"
//                       }
//                     `}
//                   >
//                     {order.status}
//                   </span>
//                 </td>

//                 {/* UPDATE */}
//                 <td>
//                   <select
//                     value={order.status}
//                     onChange={(e) =>
//                       updateStatus(order.id, e.target.value)
//                     }
//                     className="border px-2 py-1 rounded text-xs"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>

//         {filteredOrders.length === 0 && (
//           <p className="p-6 text-center text-gray-500">
//             No matching orders found
//           </p>
//         )}

//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import toast from "react-hot-toast"; // ✅ ADD THIS

interface Order {
  id: string;
  product: {
    title: string;
    image: string;
    price: number;
    qty: number;
    size?: string;
  };
  customer: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  totalAmount: number;
  status: string;
  createdAt?: any;
}

export default function OrdersPage() {
  const { loading } = useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // 🔥 REAL-TIME FIREBASE
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];

      setOrders(data.reverse());
    });

    return () => unsubscribe();
  }, []);

  // 🔍 FILTER + SEARCH
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.product.title.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : order.status === filter;

    return matchSearch && matchFilter;
  });

  // ✅ MESSAGE GENERATOR
  const getMessage = (order: Order, status: string) => {
    switch (status) {
      case "confirmed":
        return `✅ Hi ${order.customer.name}, your order "${order.product.title}" has been confirmed.`;

      case "shipped":
        return `🚚 Hi ${order.customer.name}, your order "${order.product.title}" has been shipped and is on the way!`;

      case "delivered":
        return `🎉 Hi ${order.customer.name}, your order "${order.product.title}" has been delivered. Thank you for shopping with us!`;

      default:
        return `Hi ${order.customer.name}, your order status is now ${status}.`;
    }
  };

  // 🔥 UPDATED STATUS FUNCTION
  const updateStatus = async (order: Order, status: string) => {
    try {
      // 1. Update Firestore
      await updateDoc(doc(db, "orders", order.id), { status });

      // 2. Generate message
      const message = getMessage(order, status);

      // 3. Call API (WhatsApp)
      await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: order.customer.phone,
          message,
        }),
      });

      toast.success(`Order marked as ${status}`);

    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Orders Dashboard
        </h1>

        <div className="flex gap-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by name or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg text-sm w-60"
          />

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="p-4">Product</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >
                {/* PRODUCT */}
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={order.product?.image || "/placeholder.png"}
                    className="w-14 h-14 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {order.product?.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Qty: {order.product?.qty}
                    </p>
                  </div>
                </td>

                {/* CUSTOMER */}
                <td>
                  <p className="font-medium">
                    {order.customer?.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {order.customer?.phone}
                  </p>
                </td>

                {/* AMOUNT */}
                <td className="font-semibold">
                  ₹{order.totalAmount}
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {order.status}
                  </span>
                </td>

                {/* UPDATE */}
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order, e.target.value) // ✅ FIXED
                    }
                    className="border px-2 py-1 rounded text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filteredOrders.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No matching orders found
          </p>
        )}

      </div>
    </div>
  );
}