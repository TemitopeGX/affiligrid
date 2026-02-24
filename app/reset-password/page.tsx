'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            toast.error('Invalid reset link.');
            router.push('/forgot-password');
        }
    }, [token, email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/reset-password', {
                email,
                token,
                password,
                password_confirmation: confirmPassword,
            });
            toast.success('Password reset successfully! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) return null;

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden flex bg-white font-sans p-3 lg:p-4">
            <div className="w-full h-full flex flex-col lg:flex-row gap-4">

                {/* Left Side: Visual Panel */}
                <div className="relative w-full lg:w-[45%] min-h-[280px] lg:h-full rounded-[28px] overflow-hidden flex flex-col justify-end p-8 lg:p-12 order-last lg:order-first">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111457] via-[#2a309c] to-[#111457]" />
                        <div className="absolute top-[10%] left-[15%] w-[60%] h-[50%] bg-[#FF6600] opacity-60 rounded-full blur-[80px]" />
                        <div className="absolute top-[5%] right-[10%] w-[40%] h-[45%] bg-[#ffaa33] opacity-40 rounded-full blur-[70px]" />
                        <div className="absolute bottom-[20%] left-[5%] w-[50%] h-[40%] bg-[#3a40cc] opacity-50 rounded-full blur-[60px]" />
                        <div className="absolute top-[30%] left-[30%] w-[35%] h-[35%] bg-white opacity-10 rounded-full blur-[50px]" />
                    </div>
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
                    <div className="relative z-10 mt-auto">
                        <p className="text-white/70 text-[13px] font-semibold tracking-widest uppercase mb-4">
                            Almost There
                        </p>
                        <h2 className="text-white text-[28px] lg:text-[36px] font-bold leading-[1.15] tracking-tight max-w-[420px]">
                            Set your new password and get back to business.
                        </h2>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 flex flex-col px-6 lg:px-16 py-6 lg:py-8">

                    {/* Navigation */}
                    <nav className="w-full max-w-[460px] mx-auto flex items-center justify-between mb-auto">
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
                            <Link href="/login" className="text-[13px] font-semibold text-white bg-[#111457] px-5 py-2.5 rounded-full hover:bg-[#1a1f6e] transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </nav>

                    {/* Form centered */}
                    <div className="w-full max-w-[460px] mx-auto flex flex-col justify-center flex-1">
                        <h1 className="text-[30px] lg:text-[36px] font-bold text-[#111457] tracking-tight leading-tight mb-2">
                            Reset password
                        </h1>
                        <p className="text-[#111457]/50 text-[14px] font-medium mb-8 leading-relaxed">
                            Enter your new password for <span className="font-bold text-[#111457]">{email}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-bold text-[#111457]">
                                    New password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-gray-200 py-3.5 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[15px] outline-none"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-bold text-[#111457]">
                                    Confirm new password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-gray-200 py-3.5 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[15px] outline-none"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#FF6600] py-3.5 text-[15px] font-bold text-white hover:bg-[#e65c00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                            >
                                {isLoading ? 'Resetting...' : 'Reset password'}
                            </button>
                        </form>

                        <p className="text-center text-[13px] text-[#111457]/50 font-medium mt-6">
                            remember your password?{' '}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
