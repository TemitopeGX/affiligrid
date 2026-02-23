'use client';

import { ArrowRight, Link2, Instagram, LineChart } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Claim your grid',
        description: 'Secure your unique affiligrid.com/name in seconds. No complex domain setup required.',
        ui: (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-2 pl-4 w-full max-w-[280px]">
                <span className="text-gray-400 text-sm font-medium">affiligrid.com/</span>
                <div className="bg-white border border-[#FF6600] rounded-full px-3 py-1 text-[#111457] text-sm font-bold shadow-sm">
                    yourname
                </div>
            </div>
        )
    },
    {
        number: '02',
        title: 'Add your links',
        description: 'Paste any affiliate URL from Amazon, ClickBank, or anywhere else. We handle the rest.',
        ui: (
            <div className="flex flex-col gap-2 w-full max-w-[280px]">
                <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-xl p-3">
                    <div className="w-8 h-8 rounded bg-[#111457]/5 flex items-center justify-center text-[#111457]">
                        <Link2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-1.5" />
                        <div className="w-1/2 h-1.5 bg-gray-100 rounded-full" />
                    </div>
                </div>
            </div>
        )
    },
    {
        number: '03',
        title: 'Share anywhere',
        description: 'Drop your one link in your TikTok, Instagram, or YouTube bio and funnel all your traffic to one place.',
        ui: (
            <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-full p-2 pr-4 w-full max-w-[280px]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <Instagram className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="text-xs font-bold text-[#111457]">Bio Link</div>
                    <div className="text-[10px] text-blue-500 font-medium tracking-wide">affiligrid.com/yourname</div>
                </div>
            </div>
        )
    },
    {
        number: '04',
        title: 'Track & Scale',
        description: 'Watch the clicks roll in on your granular dashboard while capturing visitors\' emails on autopilot.',
        ui: (
            <div className="flex items-center gap-4 bg-[#111457] rounded-xl p-4 w-full max-w-[280px] shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF6600]">
                    <LineChart className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-0.5">Total Clicks</div>
                    <div className="text-white text-xl font-extrabold">12,492 <span className="text-[#FF6600] text-sm">+24%</span></div>
                </div>
            </div>
        )
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-[#F9FAFB] relative border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

                    {/* Left Sticky Header */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
                        <span className="text-[#FF6600] text-sm font-bold uppercase tracking-[0.15em] mb-4 block">
                            Quick Launch
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#111457] tracking-tight leading-[1.1] mb-6">
                            From signup to sales in minutes.
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
                            We removed every friction point so you can focus entirely on growing your audience and revenue.
                        </p>

                        <a href="#" className="hidden lg:inline-flex items-center gap-2 bg-[#FF6600] text-white px-7 py-3.5 rounded-full font-bold text-[15px] hover:bg-[#e65c00] transition-colors shadow-lg shadow-[#FF6600]/20">
                            Start building for free
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Right Side: Step Cards */}
                    <div className="lg:w-2/3 flex flex-col gap-6 md:gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group hover:border-gray-200 transition-colors duration-500"
                            >
                                {/* Massive Faded Background Number */}
                                <div className="absolute right-4 md:right-8 -bottom-10 md:-bottom-16 text-[120px] md:text-[180px] font-black text-gray-50 leading-none select-none pointer-events-none group-hover:text-gray-100 transition-colors duration-500">
                                    {step.number}
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                                            <div className="w-10 h-10 rounded-full bg-[#111457] text-white flex items-center justify-center font-bold text-lg shadow-md">
                                                {index + 1}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-extrabold text-[#111457] tracking-tight">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-[16px] md:text-[17px] font-medium leading-relaxed max-w-md">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* The mini UI element snippet for context */}
                                    <div className="w-full md:w-auto flex justify-start md:justify-end">
                                        {step.ui}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Mobile CTA */}
                        <div className="mt-8 lg:hidden">
                            <a href="#" className="flex justify-center items-center gap-2 bg-[#FF6600] text-white px-7 py-4 rounded-full font-bold text-[16px] w-full hover:bg-[#e65c00] transition-colors shadow-lg shadow-[#FF6600]/20">
                                Start building for free
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
