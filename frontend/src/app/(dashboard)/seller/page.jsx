"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">128</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">₹85,200</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">5</p>
        </CardContent>
      </Card>
    </div>
  );
}
