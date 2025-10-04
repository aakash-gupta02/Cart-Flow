import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000

    },
    price: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "INR"],
            default: "INR"
        }
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Product = mongoose.model("product", productSchema);