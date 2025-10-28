"use client";
import { useState } from "react";
import api from "@/lib/api";
import OrderModal from "@/components/__pageCommons/OrderModal";

export default function CreateOrderPage() {
  const [form, setForm] = useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/order/create", form);
      setOrder(data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Shipping Details</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["street", "city", "state", "zip", "country"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 w-full rounded-md"
            required
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {order && <OrderModal order={order} />}
    </div>
  );
}
