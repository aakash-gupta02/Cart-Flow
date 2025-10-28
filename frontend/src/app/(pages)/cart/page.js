"use client";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CartPage() {
  const { cart, fetchCart, loading, clearCart, updateQuantity, removeItem } = useCartStore(); 
  
  console.log("cart: ", cart);
  

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        🛒 No items in your cart
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Cart</h1>

        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <Card
              key={item.product._id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-gray-600">
                      Price: {item.product.price.amount} {item.product.price.currency}
                    </p>



                    <p className="font-semibold text-gray-900 mt-1">
                      Total:  {item?.price?.amount} {item?.price?.currency}
                    </p>
                  </div>
                </div>


                <div className="flex flex-col items-center gap-2">


                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product._id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </Button>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="text-lg font-semibold text-gray-800">
            Total Amount: {cart?.totalAmount?.amount} {cart?.totalAmount?.currency}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Link href="/order/create">
            <Button>Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
