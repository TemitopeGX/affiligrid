'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative w-full pt-36 pb-0 md:pt-48 overflow-hidden bg-white font-sans">

            {/* Ambient color wash - brand blue, blurred and blended */}
            <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none overflow-visible">
                <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[100%] h-[600px] bg-[#111457] opacity-[0.08] rounded-full blur-[100px]" />
                <div className="absolute -top-[200px] left-[30%] w-[400px] h-[400px] bg-[#1a1f6e] opacity-[0.06] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">

                {/* Two-column Hero Content — items aligned to bottom */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12 mb-12 md:mb-16">

                    {/* Left: Massive Headline */}
                    <div className="md:w-[55%] lg:w-[52%]">
                        <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.25rem] font-medium text-[#0D0D0D] tracking-[-0.02em] leading-[1]">
                            Centralize Links,<br />
                            Maximize Affiliate<br />
                            Revenue.
                        </h1>
                    </div>

                    {/* Right: Description + CTA — bottom aligned with headline */}
                    <div className="md:w-[40%] lg:w-[38%] pb-1">
                        <p className="text-[15px] md:text-[16px] text-[#444444] font-normal leading-[1.7] mb-8">
                            Build your personal storefront, track every click in real-time, capture emails natively, and scale your affiliate revenue—all from a single, intuitive dashboard.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-[#222222] text-[#111111] text-[14px] font-semibold hover:bg-[#111111] hover:text-white transition-all duration-300 group"
                        >
                            Start Building for Free!
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>

                {/* Dashboard Screenshot — single, full width */}
                <div className="w-full relative">
                    <div className="rounded-xl overflow-hidden border border-gray-200/60 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                        <Image
                            src="/dashboard.png"
                            alt="AffiliGrid Dashboard"
                            width={1400}
                            height={900}
                            className="w-full h-auto"
                            priority
                            sizes="(max-width: 1300px) 100vw, 1300px"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
