'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
    const { user, login, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user && !isLoading) {
            router.replace('/dashboard');
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            toast.success('Welcome back!');
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                const firstError = Object.values(data.errors)[0];
                const msg = Array.isArray(firstError) ? firstError[0] : firstError;
                toast.error(msg as string);
            } else {
                toast.error(data?.message || 'Invalid email or password');
            }
        }
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
                            Technology You Can Trust
                        </p>
                        <h2 className="text-white text-[28px] lg:text-[36px] font-bold leading-[1.15] tracking-tight max-w-[420px]">
                            We help affiliates achieve more through innovative technology.
                        </h2>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 py-10 lg:py-0">
                    <div className="w-full max-w-[460px]">

                        {/* Logo */}
                        <div className="mb-10">
                            <Image
                                src="/logo-blue.svg"
                                alt="AffiliGrid Logo"
                                width={140}
                                height={32}
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Heading */}
                        <h1 className="text-[32px] lg:text-[38px] font-bold text-[#111457] tracking-tight leading-tight mb-3">
                            Sign in
                        </h1>
                        <p className="text-[#111457]/50 text-[15px] font-medium mb-10 leading-relaxed">
                            Welcome back! Sign in to your account<br />
                            to access your dashboard and manage your links.
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#111457]">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border border-gray-200 py-4 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[15px] outline-none"
                                    placeholder="test@gmail.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#111457]">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-gray-200 py-4 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[15px] outline-none"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            {/* CTA Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#FF6600] py-4 text-[16px] font-bold text-white hover:bg-[#e65c00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5" fill="#111457" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </button>
                        </div>

                        {/* Bottom link */}
                        <p className="text-center text-[14px] text-[#111457]/50 font-medium mt-8">
                            don't have an account?{' '}
                            <Link href="/signup" className="text-[#FF6600] font-semibold hover:underline underline-offset-4">
                                sign up
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
