import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },
    address: [addressSchema],
    refreshToken:{
        type:String
    }
},

    { timestamps: true }

);

const User = mongoose.model("user", userSchema);
export default User;