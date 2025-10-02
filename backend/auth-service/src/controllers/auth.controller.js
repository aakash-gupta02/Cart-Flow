import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';
import { config } from '../config/config.js';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists (case-insensitive)
  const existingUser = await User.findOne({ 
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
  })
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  // password hashing
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // create & save user
  const newUser = new User({
    name,
    email,
    password: hashedPassword
  })
  await newUser.save();

  // Remove password and __v from response
  const userResponse = newUser.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  sendResponse(res, 201, 'User Registered Successfully', { user: userResponse })


})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user exist or not (case-insensitive)
  const userExists = await User.findOne({ 
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
  })
  if (!userExists) {
    return next(new AppError("Invalid Email or Password", 400))
  }

  // checking if password is correct
  const isPasswordValid = await bcrypt.compare(password, userExists.password)
  if (!isPasswordValid) {
    return next(new AppError("Invalid email or Password", 400))
  }

  // token genration
  const token = jwt.sign(
    { userid: userExists._id, role: userExists.role }, config.jwtSecret, { expiresIn: "7h" }
  )

  // Remove password and __v from response
  const userResponse = userExists.toObject()
  delete userResponse.password
  delete userResponse.__v

  sendResponse(res, 200, 'Login Successful', {
    user: userResponse,
    token: token
  })

})
