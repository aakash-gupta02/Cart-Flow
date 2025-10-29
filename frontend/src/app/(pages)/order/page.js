"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutButton from "@/components/__pageCommons/Payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/order/me");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingOrder(orderId);
    try {
      await api.patch(`/order/cancel/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleUpdateAddress = async (orderId, addressData) => {
    setUpdatingOrder(orderId);
    try {
      await api.patch(`/order/update/${orderId}`, addressData);
      toast.success("Shipping address updated successfully");
      fetchOrders(); // Refresh orders
      return true;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
      return false;
    } finally {
      setUpdatingOrder(null);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Orders</h1>

        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onCancelOrder={handleCancelOrder}
              onUpdateAddress={handleUpdateAddress}
              cancellingOrder={cancellingOrder}
              updatingOrder={updatingOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onCancelOrder, onUpdateAddress, cancellingOrder, updatingOrder }) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: order.shippingAddress.street,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    zip: order.shippingAddress.zip,
    country: order.shippingAddress.country,
  });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdateAddress(order._id, addressForm);
    if (success) {
      setIsAddressDialogOpen(false);
    }
  };

  const canCancel = order.status === "pending" || order.status === "confirmed";
  const canUpdateAddress = order.status === "pending";

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Order ID: <span className="text-gray-600">{order._id.slice(-8)}</span>
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
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700 border-red-300"
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
        {/* Payment and Actions Section */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            Total: {order.totalPrice.amount} {order.totalPrice.currency}
          </p>
          <p className="text-sm text-gray-500">
            Payment: {order.paymentStatus || "pending"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {order.paymentStatus !== "paid" && (
            <CheckoutButton orderId={order._id} />
          )}
          
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelOrder(order._id)}
              disabled={cancellingOrder === order._id}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {cancellingOrder === order._id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Cancel Order
            </Button>
          )}

          {canUpdateAddress && (
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Update Shipping Address
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={addressForm.zip}
                        onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={updatingOrder === order._id}
                      className="flex-1"
                    >
                      {updatingOrder === order._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Address"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddressDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Separator />

        {/* Shipping Address */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-700">Shipping Address:</p>
          </div>
          <p className="text-gray-600 text-sm">
            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}, {order.shippingAddress.zip},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        <Separator />

        {/* Order Items */}
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
  );
}