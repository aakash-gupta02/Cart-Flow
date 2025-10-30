"use client";
import api from "@/lib/api";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

// Product Modal Component (Handles both Create and Edit)
const EditProductModal = ({ product, isOpen, onClose, onSuccess, mode = "edit" }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priceAmount: 0,
        priceCurrency: "INR",
        stock: "",
        category: [],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && product) {
                // Edit mode: populate with existing product data
                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    priceAmount: product.price?.amount ?? "",
                    priceCurrency: product.price?.currency ?? "INR",
                    stock: product.stock ?? "",
                    category: Array.isArray(product.category) ? product.category : [],
                });
                setImagePreview(product.image || "");
            } else {
                // Create mode: reset to empty form
                setFormData({
                    name: "",
                    description: "",
                    priceAmount: 0,
                    priceCurrency: "INR",
                    stock: "",
                    category: [],
                });
                setImagePreview("");
            }
            setImageFile(null);
            setNewCategory("");
        }
    }, [isOpen, product, mode]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !formData.category.includes(newCategory.trim())) {
            setFormData((prev) => ({
                ...prev,
                category: [...prev.category, newCategory.trim()],
            }));
            setNewCategory("");
        }
    };

    const handleRemoveCategory = (catToRemove) => {
        setFormData((prev) => ({
            ...prev,
            category: prev.category.filter((cat) => cat !== catToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            // Append all fields individually
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            submitData.append("priceAmount", formData.priceAmount);
            submitData.append("priceCurrency", formData.priceCurrency);
            submitData.append("stock", formData.stock);

            // Send category as JSON string
            submitData.append("category", JSON.stringify(formData.category));

            if (imageFile) {
                submitData.append("media", imageFile);
            }

            console.log('FormData contents:');
            for (let [key, value] of submitData.entries()) {
                console.log(key, value, typeof value);
            }

            let res;
            if (mode === "edit") {
                res = await api.patch(`/product/update/${product._id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                res = await api.post(`/product/add`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            onSuccess(res.data.product, mode);
            onClose();
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} product:`, error);
            if (error.response) {
                console.error("Server response:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        {mode === "edit" ? "Edit Product" : "Create New Product"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Image</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : mode === "edit" && product?.image ? (
                                        <Image
                                            src={product.image}
                                            alt="Current product"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {mode === "edit" ? "Choose new image to update" : "Add product image"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter product description"
                                required
                            />
                        </div>

                        {/* Price and Currency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Price Amount</label>
                                <input
                                    type="number"
                                    value={formData.priceAmount}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priceAmount: e.target.value,
                                        }))
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Currency</label>
                                <select
                                    value={formData.priceCurrency}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priceCurrency: e.target.value,
                                        }))
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                                placeholder="Enter stock quantity"
                                required
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Categories</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Add category"
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                                />
                                <Button type="button" onClick={handleAddCategory}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.category.map((cat, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {cat}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(cat)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading
                                    ? (mode === "edit" ? "Updating..." : "Creating...")
                                    : (mode === "edit" ? "Update Product" : "Create Product")
                                }
                            </Button>
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Delete Modal Component
const DeleteProductModal = ({ product, isOpen, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/product/delete/${product._id}`);
            onDelete(product._id);
            onClose();
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Delete Product</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <strong>"{product?.name}"</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? "Deleting..." : "Delete Product"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Main Products Page Component
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [creatingProduct, setCreatingProduct] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/seller/product");
            setProducts(res.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    console.log("products: ", products);
    

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p =>
            p._id === updatedProduct._id ? updatedProduct : p
        ));
    };

    const handleCreateProduct = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    const handleDeleteProduct = (productId) => {
        setProducts(prev => prev.filter(p => p._id !== productId));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-64">
            <p className="text-lg">Loading products...</p>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Products</h2>
                <Button onClick={() => setCreatingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {!products.length ? (
                <div className="flex flex-col items-center justify-center min-h-64 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg text-gray-500 mb-2">No products found</p>
                    <p className="text-sm text-gray-400 mb-4">Get started by adding your first product</p>
                    <Button onClick={() => setCreatingProduct(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Product
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card
                            key={product._id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-200 group relative"
                        >
                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setEditingProduct(product)}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setDeletingProduct(product)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="relative w-full h-48">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <CardHeader>
                                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {product.description}
                                </p>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-green-600">
                                        ₹{product.price.amount.toLocaleString()}
                                    </span>
                                    <Badge
                                        variant={product.stock > 10 ? "secondary" : "destructive"}
                                        className="text-xs"
                                    >
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </Badge>
                                </div>

                                {product.category?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {product.category.map((cat, idx) => (
                                            <Badge key={idx} variant="outline">
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <EditProductModal
                product={editingProduct}
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                onSuccess={handleUpdateProduct}
            />

            {/* Create Modal */}
            <EditProductModal
                product={null}
                isOpen={creatingProduct}
                onClose={() => setCreatingProduct(false)}
                onSuccess={handleCreateProduct}
                mode="create"
            />

            {/* Delete Modal */}
            <DeleteProductModal
                product={deletingProduct}
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
};

export default ProductsPage;