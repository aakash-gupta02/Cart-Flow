import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    razorPayOrderid: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            default: 'INR',
            enum: ['INR', "USD", "EUR"]
        }
    },

    paymentid: {
        type: String
    },
    signature: {
        type: String
    },
}, { timestamps: true });


export const Payment = mongoose.model('Payment', paymentSchema);