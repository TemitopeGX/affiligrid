'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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
            const msg = err.response?.data?.message || 'Registration failed';
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
        <div className="min-h-screen lg:h-screen lg:overflow-hidden flex bg-white font-sans p-3 lg:p-4">
            <div className="w-full h-full flex flex-col lg:flex-row gap-4">

                {/* Left Side: Visual Panel — order-last on mobile so form comes first */}
                <div className="relative w-full lg:w-[45%] min-h-[320px] lg:h-full rounded-[28px] overflow-hidden flex flex-col justify-end p-8 lg:p-12 order-last lg:order-first">
                    {/* Abstract Gradient Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111457] via-[#2a309c] to-[#111457]" />
                        {/* Organic color blobs */}
                        <div className="absolute top-[10%] left-[15%] w-[60%] h-[50%] bg-[#FF6600] opacity-60 rounded-full blur-[80px]" />
                        <div className="absolute top-[5%] right-[10%] w-[40%] h-[45%] bg-[#ffaa33] opacity-40 rounded-full blur-[70px]" />
                        <div className="absolute bottom-[20%] left-[5%] w-[50%] h-[40%] bg-[#3a40cc] opacity-50 rounded-full blur-[60px]" />
                        <div className="absolute top-[30%] left-[30%] w-[35%] h-[35%] bg-white opacity-10 rounded-full blur-[50px]" />
                    </div>

                    {/* Logo overlay fading into the card */}
                    <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                        <Image
                            src="/logo-white.png"
                            alt="AffiliGrid Watermark"
                            width={280}
                            height={280}
                            className="object-contain opacity-[0.12]"
                            style={{
                                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                            }}
                        />
                    </div>

                    {/* Text overlay at the bottom */}
                    <div className="relative z-10 mt-auto">
                        <p className="text-white/70 text-[13px] font-semibold tracking-widest uppercase mb-4">
                            Start Your Journey
                        </p>
                        <h2 className="text-white text-[28px] lg:text-[36px] font-bold leading-[1.15] tracking-tight max-w-[420px]">
                            Join thousands of affiliates building their empires.
                        </h2>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 flex flex-col px-6 lg:px-16 py-6 lg:py-8">

                    {/* Navigation */}
                    <nav className="w-full max-w-[460px] mx-auto flex items-center justify-between">
                        <Link href="/">
                            <Image
                                src="/logo-blue.svg"
                                alt="AffiliGrid Logo"
                                width={130}
                                height={30}
                                className="object-contain"
                                priority
                            />
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-[13px] font-semibold text-[#111457]/60 hover:text-[#111457] transition-colors hidden sm:block">
                                Home
                            </Link>
                            <Link href="/login" className="text-[13px] font-semibold text-white bg-[#111457] px-5 py-2.5 rounded-full hover:bg-[#1a1f6e] transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </nav>

                    {/* Form centered */}
                    <div className="w-full max-w-[460px] mx-auto flex flex-col justify-center flex-1">
                        <h1 className="text-[28px] lg:text-[34px] font-bold text-[#111457] tracking-tight leading-tight mb-1">
                            Create an account
                        </h1>
                        <p className="text-[#111457]/50 text-[13px] font-medium mb-6 leading-relaxed">
                            Start your journey with us. Unlock all features.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[13px] font-bold text-[#111457]">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border border-gray-200 py-3 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[14px] outline-none"
                                    placeholder="johndoe"
                                />
                                <p className="text-[11px] text-[#111457]/40 font-medium">affiligrid.com/johndoe</p>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[13px] font-bold text-[#111457]">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border border-gray-200 py-3 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[14px] outline-none"
                                    placeholder="test@gmail.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[13px] font-bold text-[#111457]">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border border-gray-200 py-3 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[14px] outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[13px] font-bold text-[#111457]">
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border border-gray-200 py-3 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[14px] outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#FF6600] py-3.5 text-[15px] font-bold text-white hover:bg-[#e65c00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <p className="text-center text-[13px] text-[#111457]/50 font-medium mt-5">
                            you already have an account?{' '}
                            <Link href="/login" className="text-[#FF6600] font-semibold hover:underline underline-offset-4">
                                sign in
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
