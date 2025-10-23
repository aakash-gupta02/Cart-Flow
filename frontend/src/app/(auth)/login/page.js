'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { loginSchema, validate } from '@/lib/validators/authValidator';


export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const { isValid, errors } = validate(loginSchema, { email, password });
        if (!isValid) {
            setError(errors.join(', '));
            return;
        }

        try {
            // Call backend API directly
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            // Cookies already set by backend (Axios withCredentials)
            router.push('/'); // Redirect after login
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Unable to connect to server. Please try again later.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="p-2 border rounded"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
