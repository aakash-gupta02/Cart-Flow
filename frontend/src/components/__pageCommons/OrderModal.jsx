"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderModal({ order }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          ✅ Order Placed Successfully!
        </h2>

        <p className="text-gray-700 mb-2">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Total: {order.totalPrice.amount} {order.totalPrice.currency}
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/order")}>View My Orders</Button>
          <Button variant="outline" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
