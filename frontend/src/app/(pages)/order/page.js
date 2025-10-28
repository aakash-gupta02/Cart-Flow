"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutButton from "@/components/__pageCommons/Payment";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/order/me");
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        🧾 No orders found
      </div>
    );

    console.log(orders);
    

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-10 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Orders</h1>

        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">
                    Total: {order.totalPrice.amount} {order.totalPrice.currency}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentStatus || "pending"}
                  </p>

                  {/* buy now button */}
                  {/* <Button onClick={() => handleBuyNow(order)}>Buy Now</Button> */}
                  {order.paymentStatus !== "paid" && <CheckoutButton orderId={order._id} />}
                </div>

                <Separator />

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Shipping Address:</p>
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}, {order.shippingAddress.zip},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Items:</p>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 rounded-lg p-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {item.price.amount} {item.price.currency}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
