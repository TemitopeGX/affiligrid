'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Start a 2-minute countdown
    const startCountdown = () => {
        setCountdown(120);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/forgot-password', { email });
            toast.success('Reset code sent! Check your email.');
            setStep('code');
            startCountdown();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/verify-reset-code', { email, code });
            toast.success('Code verified! Redirecting...');
            router.push(`/reset-password?token=${res.data.token}&email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setIsLoading(true);
        try {
            await api.post('/forgot-password', { email });
            toast.success('New code sent!');
            setCode('');
            startCountdown();
        } catch (err: any) {
            toast.error('Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

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
                            Account Recovery
                        </p>
                        <h2 className="text-white text-[28px] lg:text-[36px] font-bold leading-[1.15] tracking-tight max-w-[420px]">
                            Don&apos;t worry, we&apos;ll help you get back in.
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
                            <Link href="/login" className="text-[13px] font-semibold text-[#111457]/60 hover:text-[#111457] transition-colors">
                                Sign in
                            </Link>
                            <Link href="/signup" className="text-[13px] font-semibold text-white bg-[#111457] px-5 py-2.5 rounded-full hover:bg-[#1a1f6e] transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </nav>

                    {/* Form centered */}
                    <div className="w-full max-w-[460px] mx-auto flex flex-col justify-center flex-1">

                        {step === 'email' ? (
                            <>
                                <h1 className="text-[30px] lg:text-[36px] font-bold text-[#111457] tracking-tight leading-tight mb-2">
                                    Forgot password?
                                </h1>
                                <p className="text-[#111457]/50 text-[14px] font-medium mb-8 leading-relaxed">
                                    Enter your email and we&apos;ll send you a reset code.
                                </p>

                                <form onSubmit={handleSendCode} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-[13px] font-bold text-[#111457]">
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-xl border border-gray-200 py-3.5 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-medium text-[15px] outline-none"
                                            placeholder="test@gmail.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-full bg-[#FF6600] py-3.5 text-[15px] font-bold text-white hover:bg-[#e65c00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                                    >
                                        {isLoading ? 'Sending...' : 'Send reset code'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h1 className="text-[30px] lg:text-[36px] font-bold text-[#111457] tracking-tight leading-tight mb-2">
                                    Enter reset code
                                </h1>
                                <p className="text-[#111457]/50 text-[14px] font-medium mb-2 leading-relaxed">
                                    We sent a 6-digit code to <span className="font-bold text-[#111457]">{email}</span>
                                </p>
                                {countdown > 0 && (
                                    <p className="text-[#FF6600] text-[13px] font-bold mb-6">
                                        Code expires in {formatTime(countdown)}
                                    </p>
                                )}
                                {countdown === 0 && step === 'code' && (
                                    <p className="text-red-500 text-[13px] font-semibold mb-6">
                                        Code expired.{' '}
                                        <button onClick={handleResend} className="text-[#FF6600] underline underline-offset-4 hover:no-underline">
                                            Resend code
                                        </button>
                                    </p>
                                )}

                                <form onSubmit={handleVerifyCode} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-[13px] font-bold text-[#111457]">
                                            6-digit code
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                            className="block w-full rounded-xl border border-gray-200 py-3.5 px-5 text-[#111457] bg-white placeholder:text-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all font-bold text-[24px] tracking-[0.4em] text-center outline-none"
                                            placeholder="000000"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || code.length !== 6}
                                        className="w-full rounded-full bg-[#FF6600] py-3.5 text-[15px] font-bold text-white hover:bg-[#e65c00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify code'}
                                    </button>
                                </form>
                            </>
                        )}

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
