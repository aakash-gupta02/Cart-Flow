// hooks/useRazorpay.js
import { useEffect, useState } from 'react';

export const useRazorpay = () => {
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const loadRazorpayScript = async () => {
            if (window.Razorpay) {
                setRazorpayLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        };

        loadRazorpayScript();
    }, []);

    return razorpayLoaded;
};