"use client";
import React, { useEffect, useState } from 'react'
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MapPin,
    User,
    Calendar,
    IndianRupee
} from 'lucide-react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filter, setFilter] = useState('all')

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const res = await api.get('/seller/order')
            console.log('Orders data:', res.data.orders)
            setOrders(res.data.orders)
        } catch (error) {
            console.log('Error fetching orders data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'processing': return <Package className="h-4 w-4" />;
            case 'shipped': return <Truck className="h-4 w-4" />;
            case 'delivered': return <CheckCircle className="h-4 w-4" />;
            case 'cancelled': return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const getPaymentStatusColor = (status) => {
        return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/seller/order/${orderId}`, { status: newStatus });
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage and track customer orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchOrders}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold mt-1">{orders.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold mt-1">
                                    {orders.filter(order => order.status === 'pending').length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold mt-1">
                                    {orders.filter(order => order.status === 'delivered').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                <p className="text-2xl font-bold mt-1">
                                    {orders.filter(order => order.status === 'cancelled').length}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    All Orders
                </Button>
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </Button>
                <Button
                    variant={filter === 'processing' ? 'default' : 'outline'}
                    onClick={() => setFilter('processing')}
                >
                    Processing
                </Button>
                <Button
                    variant={filter === 'shipped' ? 'default' : 'outline'}
                    onClick={() => setFilter('shipped')}
                >
                    Shipped
                </Button>
                <Button
                    variant={filter === 'delivered' ? 'default' : 'outline'}
                    onClick={() => setFilter('delivered')}
                >
                    Delivered
                </Button>
                <Button
                    variant={filter === 'cancelled' ? 'default' : 'outline'}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled
                </Button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">
                                {filter === 'all'
                                    ? "You haven't received any orders yet."
                                    : `No orders with ${filter} status.`
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredOrders.map((order) => (
                        <Card key={order._id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-mono text-sm font-semibold">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                        <Package className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-gray-600">× {item.quantity}</span>
                                                    <span className="text-green-600 font-semibold">
                                                        ₹{item.price?.amount?.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Customer & Date */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>Customer: {order.user?.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Total */}
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                                                <IndianRupee className="h-5 w-5" />
                                                {order.totalPrice.amount.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>

                                            {/* Status Update Buttons */}
                                            {order.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateOrderStatus(order._id, 'processing')}
                                                >
                                                    Process Order
                                                </Button>
                                            )}
                                            {order.status === 'processing' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateOrderStatus(order._id, 'shipped')}
                                                >
                                                    Mark Shipped
                                                </Button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                                                >
                                                    Mark Delivered
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold">Order Details</h2>
                                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Order Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Order ID</p>
                                                <p className="font-semibold">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Order Date</p>
                                                <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <Badge className={getStatusColor(selectedOrder.status)}>
                                                    {selectedOrder.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Payment</p>
                                                <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                                                    {selectedOrder.paymentStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Items */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold text-green-600">
                                                        ₹{item.price?.amount?.toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-3 border-t">
                                                <p className="font-semibold">Total</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    ₹{selectedOrder.totalPrice.amount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1 text-sm">
                                            <p><strong>Street:</strong> {selectedOrder.shippingAddress.street}</p>
                                            <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
                                            <p><strong>State:</strong> {selectedOrder.shippingAddress.state}</p>
                                            <p><strong>ZIP:</strong> {selectedOrder.shippingAddress.zip}</p>
                                            <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrdersPage