import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const steps = ["pending", "confirmed", "shipped", "delivered"];

const labels: any = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default async function TrackOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;

  const snap = await getDoc(doc(db, "orders", orderId));

  if (!snap.exists()) {
    return (
      <div className="h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const order = snap.data();
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-semibold mb-6">Track Order</h1>

        <div className="flex gap-4 mb-6 border-b pb-4">
          <img
            src={order.product?.image}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-medium">{order.product?.title}</h2>
            <p className="text-sm text-gray-500">
              Qty: {order.product?.qty}
            </p>
            <p className="font-semibold">₹{order.totalAmount}</p>
          </div>
        </div>

        <div>
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;

            return (
              <div key={step} className="flex items-center gap-4 mb-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    isActive ? "bg-black" : "bg-gray-300"
                  }`}
                />
                <p className={isActive ? "text-black" : "text-gray-400"}>
                  {labels[step]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <span className="px-4 py-2 bg-black text-white rounded-full text-sm capitalize">
            {order.status}
          </span>
        </div>

      </div>
    </div>
  );
}