// components/CheckoutPage.jsx
import { useRazorpay } from '../hooks/useRazorpay';
import axios from 'axios';
import React from 'react';

const CheckoutPage = () => {
    const razorpayLoaded = useRazorpay();
    const key = "rzp_test_RQH6TmVMafCQ20"
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2OGUxNDE4MTc1NDQ5NTBmMmMxODE4NTEiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzU5ODMxNDE1LCJleHAiOjE3NTk4MzUwMTV9.n-kMum1p_qN7o9wuGEfeYpT_WFWhfQ9V_gtC8Pfh-jQ"

    const response =
    {
        price: {
            amount: 90000,
            currency: "INR"
        },
        _id: "68e5330412451ce616279ef7",
        order: "68e53230785c88a049e1f386",
        razorPayOrderid: "order_RQdNgxvXD6Myeg",
        status: "pending",
        user: "68e141817544950f2c181851",
        createdAt: "2025-10-07T10:20:20.995Z",
        updatedAt: "2025-10-07T10:20:20.995Z",
        __v: 0
    }

    const razorpayResponse = {

        razorpay_payment_id: 'pay_RQdP1ZqEXzWXrH',
        razorpay_order_id: 'order_RQdNgxvXD6Myeg',
        razorpay_signature: '9aa9cf7b18f09497c6dda3bb9b24bfc0dd064127e4b43f1dbfd0860612288e05'
    }



    const handlePayment = async () => {
        if (!razorpayLoaded) {
            alert('Razorpay still loading...');
            return;
        }

        try {
            const options = {
                key: key,
                amount: response.price.amount, // 1460
                currency: response.price.currency, // "INR"
                name: "Cart Flow",
                description: `Order #${response.order}`,
                order_id: response.razorPayOrderid, // "order_RQIPbMACwlkreq"
                handler: async function (razorpayResponse) {
                    // THIS is where you get the actual payment data
                    console.log('Razorpay Response:', razorpayResponse);
                    console.log('Order ID:', response.order);


                    try {
                        const verifyResponse = await axios.post(
                            `http://localhost:3004/api/payment/verify/${response.order}`, // Add orderId to URL
                            {
                                razorPayPaymentid: razorpayResponse.razorpay_payment_id,
                                razorPayOrderid: razorpayResponse.razorpay_order_id,
                                razorPaySignature: razorpayResponse.razorpay_signature
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cookie': `accessToken=${accessToken}`
                                },
                                withCredentials: true
                            }
                        );
                        console.log('Verification Response:', verifyResponse.data);
                        alert('Payment successful and verified!');

                    } catch (error) {
                        console.error('Verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#3399cc" }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment initialization failed');
        }
    };

    const verifySubmit = async (razorpayResponse) => {

        try {
            const verifyResponse = await axios.post(
                `http://localhost:3004/api/payment/verify/${response.order}`, // Add orderId to URL
                {
                    razorPayPaymentid: razorpayResponse.razorpay_payment_id,
                    razorPayOrderid: razorpayResponse.razorpay_order_id,
                    razorPaySignature: razorpayResponse.razorpay_signature
                },
                {
                    headers: {
                        'cookie': `accessToken=${accessToken}`
                    },
                    withCredentials: true
                }
            );
            console.log('Verification Response:', verifyResponse.data);
            alert('Payment successful and verified!');

        } catch (error) {
            console.error('Verification failed:', error);
            alert('Payment verification failed');
        }

    }

    return (
        <div>
            <button
                onClick={handlePayment}
                disabled={!razorpayLoaded}
            >
                {razorpayLoaded ? 'Pay Now' : 'Loading...'}
            </button>
        </div>
    );
};

export default CheckoutPage;    