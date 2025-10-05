import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

        }
    ]
},
    {
        timestamps: true,
    }
)

const Cart =  mongoose.model("cart", cartSchema);
export default Cart;