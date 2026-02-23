'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Grid3x3, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
    const { register, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            });
            toast.success('Account created successfully!');
        } catch (err: any) {
            // Error handling from Context/API
            const msg = err.response?.data?.message || 'Registration failed';

            // If validation errors (e.g. username taken)
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0] as string[];
                toast.error(firstError[0]);
            } else {
                toast.error(msg);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                        <Grid3x3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">AFFILIGRID</span>
                </Link>

                <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-900">
                                Username
                            </label>
                            <div className="mt-2 relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    placeholder="johndoe"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">This will be your profile URL: affiligrid.com/johndoe</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link href="/terms" className="font-semibold text-orange-600 hover:text-orange-500">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="font-semibold text-orange-600 hover:text-orange-500">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center text-base py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
