import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            amount: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                required: true,
                enum: ["USD", "EUR", "INR"]
            }
        }
    }],

    totalPrice: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            enum: ["USD", "EUR", "INR"]
        }
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },

    shippingAddress: addressSchema,
},
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema);
export default Order;

