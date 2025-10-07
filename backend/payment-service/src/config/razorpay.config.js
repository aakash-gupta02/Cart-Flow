import Razorpay from 'razorpay';
import { config } from './config.js';

const razorpayInstance = new Razorpay({
    key_id: config.razorPayKeyId,
    key_secret: config.razorPayKeySecret
});

export default razorpayInstance;