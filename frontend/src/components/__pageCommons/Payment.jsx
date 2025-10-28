"use client";
import React from "react";
import api from "@/lib/api";
import { useRazorpay } from "@/lib/hooks/useRazorpay";

const CheckoutButton = ({ orderId }) => {
  const razorpayLoaded = useRazorpay();

  const handlePayment = async () => {
    if (!razorpayLoaded) return alert("Razorpay loading...");

    try {
      // 1️⃣ Create Razorpay order
      const { data } = await api.get(`/payment/create/${orderId}`);
      const payment = data.payment;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payment.price.amount * 100,
        currency: payment.price.currency,
        name: "Cart Flow",
        description: `Order #${payment.order}`,
        order_id: payment.razorPayOrderid,
        handler: async function (res) {
          try {
            // 3️⃣ Verify Payment
            const verifyRes = await api.post(
              `/payment/verify/${payment.order}`,
              {
                razorPayPaymentid: res.razorpay_payment_id,
                razorPayOrderid: res.razorpay_order_id,
                razorPaySignature: res.razorpay_signature,
              }
            );
            console.log("Verification:", verifyRes.data);
            alert("Payment successful and verified!");
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment init failed:", error);
      alert("Payment failed to initialize");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!razorpayLoaded}
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      {razorpayLoaded ? "Checkout" : "Loading..."}
    </button>
  );
};

export default CheckoutButton;
