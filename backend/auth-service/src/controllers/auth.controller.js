import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';
import { config } from '../config/config.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import jwt from 'jsonwebtoken';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

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
    password: hashedPassword,
    role
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

  let accessToken = generateAccessToken(userExists)
  let refreshToken = generateRefreshToken(userExists)

  // Store refresh token in DB
  let hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
  userExists.refreshToken = hashedRefreshToken
  await userExists.save()

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  // Remove password and __v from response
  const userResponse = userExists.toObject()
  delete userResponse.password
  delete userResponse.__v
  delete userResponse.refreshToken

  sendResponse(res, 200, 'Login Successful', {
    user: userResponse,
    accessToken: accessToken ? true : false, // just to inform client that access token is sent in httpOnly cookie
    refreshTokenSent: refreshToken ? true : false // just to inform client that refresh token is sent in httpOnly cookie
  })

})

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new AppError("Refresh token required", 401));
  }

  jwt.verify(refreshToken, config.jwtSecret , async (err, decoded) => {
    if (err) return next(new AppError("Invalid or expired refresh token", 403));


    const user = await User.findById(decoded.userid);
    if (!user) return next(new AppError("User not found", 404));

    // Issue new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new AppError("Refresh token required", 401));
  }

  jwt.verify(refreshToken, config.jwtSecret , async (err, decoded) => {
    if (err) return next(new AppError("Invalid or expired refresh token", 403));

    const user = await User.findById(decoded.userid);
    if (!user) return next(new AppError("User not found", 404));

    // Remove refresh token from DB
    user.refreshToken = null;
    await user.save();

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.userid).select('-password -__v -refreshToken');
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  sendResponse(res, 200, 'User Profile fetched successfully', { user });
});

export const usersProfile = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password -__v -refreshToken');
  sendResponse(res, 200, 'Users fetched successfully', { users });
})