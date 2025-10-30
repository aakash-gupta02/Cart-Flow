"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get("/seller/overview");
      console.log("Overview data:", res.data.overview);
      setOverviewData(res.data.overview);
    } catch (error) {
      console.log("Error fetching overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!overviewData) return <p>No overview data available</p>;

  const { orderCount, productCount, totalRevenue, totalSales } = overviewData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {/* Total Orders */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-blue-600">{orderCount}</p>
        </CardContent>
      </Card>

      {/* Products Listed */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Products Listed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-indigo-600">{productCount}</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-orange-600">{totalSales}</p>
        </CardContent>
      </Card>
    </div>
  );
}


