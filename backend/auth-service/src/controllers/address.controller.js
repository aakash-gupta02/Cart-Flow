import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAddress =  catchAsync(async (req, res, next)=>{

    const userid = req.user.userid; 
    
    console.log(userid);
    
    const user = await User.findById(userid)
    console.log(user);
    
    
    if(!user){
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        success: true,
        address: user.address
    })

})

export const addAddress = catchAsync(async (req, res, next)=>{

    const userid = req.user.userid; 
    const { street, city, state, zip, country, isDefault } = req.body;
    
    const user = await User.findById(userid)
    
    if(!user){
        return next(new AppError("User not found", 404));
    }

    user.address.push({ street, city, state, zip, country, isDefault });
    await user.save();

    res.status(200).json({
        success: true,
        message: "Address added successfully",
        address: user.address
    })

})

export const updateAddress = catchAsync(async (req, res, next) => {
    const userid = req.user.userid;
    const addressId = req.params.id;
    const { street, city, state, zip, country, isDefault } = req.body;

    const user = await User.findById(userid);
    if (!user) {
        return next(new AppError("User Not Found", 404));
    }

    // Find the address by _id in the array
    const address = user.address.find(addr => addr._id.toString() === addressId);
    if (!address) {
        return next(new AppError("Address Not Found", 404));
    }

    // Update fields if provided
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zip = zip || address.zip;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address: user.address
    });
});

export const deleteAddress = catchAsync(async (req, res, next) => {
    const userid = req.user.userid;
    const addressId = req.params.id;

    const user = await User.findById(userid);
    if (!user) {
        return next(new AppError("User Not Found", 404));
    }

    // Find the address index by _id in the array
    const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
        return next(new AppError("Address Not Found", 404));
    }

    // Remove the address from the array
    user.address.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        address: user.address
    });
});