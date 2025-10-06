// src/utils/order.utils.js
export const generateOrderDetails = (cart, products, userId, shippingAddress) => {
  if (!cart || !cart.items || cart.items.length === 0)
    throw new Error("Cart is empty");

  const orderItems = cart.items.map(item => {
    const product = products.find(p => p._id === item.product);
    if (!product) throw new Error(`Product not found for ID: ${item.product}`);

    return {
      product: item.product,
      quantity: item.quantity,
      price: {
        amount: product.price.amount,
        currency: product.price.currency,
      },
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  );

  return {
    user: userId,
    items: orderItems,
    totalPrice: {
      amount: totalAmount,
      currency: "INR",
    },
    shippingAddress,
    status: "pending",
  };
};
