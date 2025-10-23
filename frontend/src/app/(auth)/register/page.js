'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { registerSchema, validate } from '@/lib/validators/authValidator';
import { ArrowRight, Box, Github, Chrome, X } from 'lucide-react';
import Link from 'next/link';
import AuthImage from '@/components/__pageCommons/AuthImage';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');

        const { isValid, errors } = validate(registerSchema, { name, email, password, role });
        if (!isValid) {
            setError(errors.join(', '));
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', { name, email, password, role });
            router.push('/login'); // Redirect to login after successful registration
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Unable to register. Please try again later.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:max-w-5xl overflow-hidden flex flex-col lg:flex-row bg-white/80 border-white/20 border rounded-3xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            {/* Left / Form */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12">
                <div className="inline-flex items-center px-3 py-1 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium mb-8 md:mb-12">
                    <Box className="w-4 h-4 mr-2" />
                    CartFlow
                </div>

                <h1 className="text-3xl md:text-4xl text-slate-900 tracking-tight font-bold">
                    Create your account
                </h1>
                <p className="text-slate-600 mt-2 text-base">
                    Get started with CartFlow for free.
                </p>

                {error && (
                    <div className="text-red-600 mt-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm flex items-start">
                        <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label className="sr-only" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full rounded-xl py-3 px-4 border border-slate-200 bg-white/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="sr-only" htmlFor="email">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email address"
                            required
                            className="w-full rounded-xl py-3 px-4 border border-slate-200 bg-white/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="sr-only" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Password"
                            required
                            className="w-full rounded-xl py-3 px-4 border border-slate-200 bg-white/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="sr-only" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            required
                            className="w-full rounded-xl py-3 px-4 border border-slate-200 bg-white/50 text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                        >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl py-3 px-6 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center w-full gap-2 rounded-xl border border-slate-200 bg-white/50 py-3 hover:bg-white/70 hover:border-slate-300 transition-all duration-200 group"
                        >
                            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-slate-700">GitHub</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center w-full gap-2 rounded-xl border border-slate-200 bg-white/50 py-3 hover:bg-white/70 hover:border-slate-300 transition-all duration-200 group"
                        >
                            <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-slate-700">Google</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <span>
                        Already have an account?{' '}
                        <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                            Login
                        </Link>
                    </span>
                </div>
            </div>

            {/* Right / Image */}
                <AuthImage />
        </div>
    );
}
