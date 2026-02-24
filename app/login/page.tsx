'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
    const { user, login, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

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
        <div className="min-h-screen md:h-screen md:overflow-hidden flex bg-[#FAFBFF] font-sans items-center justify-center p-4 lg:p-6">
            <div className="w-full h-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

                {/* Left Side: Form */}
                <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center lg:items-start max-w-[420px] mx-auto lg:mx-0 lg:pl-10 py-8 lg:py-0">

                    {/* Navigation / Logo */}
                    <div className="w-full flex justify-center lg:justify-start mb-8">
                        <Link href="/" className="inline-flex flex-col items-center lg:items-start gap-4 group">
                            <span className="text-[13px] font-bold text-[#111457]/60 group-hover:text-[#FF6600] transition-colors flex items-center gap-1">
                                ← Back to Home
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#111457] rounded-xl group-hover:scale-105 transition-transform">
                                    <span className="text-white font-bold text-[12px] tracking-wider">AG</span>
                                </div>
                                <span className="text-[22px] font-bold tracking-tight text-[#111457] uppercase">
                                    AffiliGrid
                                </span>
                            </div>
                        </Link>
                    </div>

                    <h1 className="text-[32px] font-bold text-[#111457] mb-8">Sign in</h1>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-2">
                            <label className="block text-[13px] font-bold text-[#111457]">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-[#111457]/40 group-focus-within:text-[#FF6600] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-[14px] border border-gray-200 py-3.5 pl-11 pr-4 text-[#111457] bg-white shadow-sm hover:border-gray-300 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] placeholder:text-gray-400 transition-all font-medium text-[14px] outline-none"
                                    placeholder="johndoe@gmail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[13px] font-bold text-[#111457]">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-[#111457]/40 group-focus-within:text-[#FF6600] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-[14px] border border-gray-200 py-3.5 pl-11 pr-4 text-[#111457] bg-white shadow-sm hover:border-gray-300 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] placeholder:text-gray-400 transition-all font-medium text-[14px] outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors border ${rememberMe ? 'bg-[#FF6600] border-[#FF6600]' : 'border-gray-300 bg-white'}`}
                            >
                                {rememberMe && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </button>
                            <span className="text-[13px] font-bold text-[#111457]">Remember me</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-[12px] bg-[#111457] py-3.5 text-[14px] font-bold text-white hover:bg-[#1a1f6e] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-2"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-5 text-[13px] text-[#111457]/60 font-medium space-y-1 text-center lg:text-left w-full">
                        <p>
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-[#FF6600] hover:underline font-semibold">
                                Sign up
                            </Link>
                        </p>
                        <p>
                            <Link href="/forgot-password" className="text-[#111457] hover:text-[#FF6600] transition-colors font-semibold">
                                Forgot Password
                            </Link>
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start w-full">
                        <button className="w-12 h-12 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all text-[#111457]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right Side: Brand Panel */}
                <div className="hidden lg:flex lg:w-[55%] h-full bg-[#111457] rounded-[32px] p-12 relative overflow-hidden flex-col shadow-2xl">

                    {/* Light Streaks across the background mimicking the screenshot */}
                    <div className="absolute top-[-20%] right-[10%] w-[10px] h-[150%] bg-white/5 rotate-[35deg] pointer-events-none" />
                    <div className="absolute top-[-20%] right-[3%] w-[60px] h-[150%] bg-gradient-to-r from-white/5 to-transparent rotate-[35deg] pointer-events-none" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[1px] h-[50%] bg-[#FF6600]/30 rotate-[35deg] pointer-events-none" />

                    {/* Glowing Accent */}
                    <div className="absolute bottom-[30%] right-[15%] w-32 h-32 rounded-full bg-[#FF6600] opacity-20 blur-[60px] pointer-events-none" />
                    <div className="absolute top-[20%] left-[10%] w-40 h-40 rounded-full bg-[#0a0a3a] opacity-50 blur-[80px] pointer-events-none" />

                    {/* Hero Graphic - Big 'AG' */}
                    <div className="relative w-full flex justify-center mt-auto mb-auto">
                        <div className="relative flex justify-center tracking-tighter mix-blend-overlay opacity-60">
                            <span className="text-[240px] font-black leading-none text-white filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                                AG
                            </span>
                        </div>
                    </div>

                    <div className="z-10 relative mt-auto max-w-[460px]">
                        <h3 className="text-[#FF6600] text-[14px] font-bold tracking-widest uppercase mb-3">AffiliGrid</h3>
                        <h2 className="text-white text-[32px] font-bold leading-tight mb-4 tracking-tight">
                            Welcome to AffiliGrid
                        </h2>
                        <p className="text-white/70 text-[14px] leading-relaxed mb-6">
                            AffiliGrid helps creators build organized and high-converting storefronts full of beautiful and rich modules. Join us and start building your audience today.
                        </p>

                        {/* Asymmetric Inner Box */}
                        <div className="bg-[#1a1f6e] border border-white/5 rounded-[24px] rounded-tr-[80px] p-8 pb-10 relative shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                            <h4 className="text-white text-[18px] font-medium mb-3 pr-12 leading-snug">
                                Get your perfect storefront and start earning now
                            </h4>
                            <p className="text-white/60 text-[13px] leading-relaxed max-w-[260px]">
                                Be among the first founders to experience the easiest way to start and run a business.
                            </p>

                            {/* Social Avatars Group */}
                            <div className="absolute bottom-6 right-8 flex -space-x-3">
                                {[32, 44, 68].map((imgId, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-[3px] border-[#1a1f6e] bg-gray-600 overflow-hidden shadow-sm relative z-10 hover:z-20 hover:scale-110 transition-transform">
                                        <Image src={`https://i.pravatar.cc/100?img=${imgId}`} alt={`User ${i}`} width={36} height={36} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-9 h-9 rounded-full border-[3px] border-[#1a1f6e] bg-[#FF6600] text-white text-[11px] font-bold flex items-center justify-center relative z-10">
                                    +2
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
