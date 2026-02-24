'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
                // Get first error message from Laravel validation object
                const firstError = Object.values(data.errors)[0];
                const msg = Array.isArray(firstError) ? firstError[0] : firstError;
                toast.error(msg as string);
            } else {
                toast.error(data?.message || 'Invalid email or password');
            }
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-[#FAFBFF] font-sans">
            {/* Left/Top side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[45%] xl:w-[40%]">
                <div className="mx-auto w-full max-w-sm lg:max-w-md xl:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 mb-10 transition-transform hover:scale-105 origin-left w-fit">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#111457]">
                            <span className="text-white font-bold text-[11px] tracking-wider">AG</span>
                        </div>
                        <span className="text-[18px] font-bold tracking-tight text-[#111457] uppercase">
                            AffiliGrid
                        </span>
                    </Link>

                    <div>
                        <h2 className="mt-2 text-[32px] font-bold leading-9 tracking-tight text-[#111457]">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-[15px] leading-6 text-[#111457]/60">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-semibold text-[#FF6600] hover:text-[#e65c00] transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-[#111457]">
                                    Email address
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-xl border-0 py-3.5 pl-11 text-[#111457] shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111457] sm:text-sm sm:leading-6 bg-white outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold leading-6 text-[#111457]">
                                    Password
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-xl border-0 py-3.5 pl-11 text-[#111457] shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111457] sm:text-sm sm:leading-6 bg-white outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[#111457] focus:ring-[#111457]"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm leading-6 text-[#111457]/80">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm leading-6">
                                    <Link href="/forgot-password" className="font-semibold text-[#111457] hover:text-[#FF6600] transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111457] px-3 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#1a1f6e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111457] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in to workspace'}
                                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-[#FAFBFF] px-3 text-sm font-medium text-gray-500">or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Visual/Branding */}
            <div className="relative hidden w-0 flex-1 lg:flex lg:flex-col lg:justify-center bg-[#111457] overflow-hidden">
                {/* SVG Pattern Background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='white'/%3E%3C/svg%3E")`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Soft ambient glows */}
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#FF6600] opacity-20 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#2a309c] opacity-50 rounded-full blur-[150px] pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative px-16 lg:px-24 z-10">
                    <div className="max-w-xl">
                        <div className="mb-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[13px] font-medium backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-[#FF6600]"></span>
                            AffiliGrid Dashboard
                        </div>

                        <h3 className="text-[2.5rem] md:text-[3.25rem] font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            The standard for modern affiliate marketers.
                        </h3>
                        <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed font-normal">
                            Join top creators using AffiliGrid to centralize their links, capture audiences, and scale conversion rates without touching an ounce of code.
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                'Beautiful custom storefronts',
                                'Real-time performance analytics',
                                'Built-in email capture',
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="bg-[#FF6600]/20 p-1 rounded-md">
                                        <CheckCircle2 className="w-5 h-5 text-[#FF6600]" />
                                    </div>
                                    <span className="text-white font-medium text-[16px]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
