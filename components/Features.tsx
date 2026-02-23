'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        title: 'Easy to manage dashboard',
        desc: 'Everything you need to grow your affiliate business is available at your fingertips. From layout controls to product management.',
        subs: [
            { label: 'Centralized control', text: 'Manage products and view analytics from one screen.' },
            { label: 'Intuitive design', text: 'No complex menus or steep learning curves.' },
        ],
        visual: 'dashboard',
    },
    {
        title: 'Your personal storefront',
        desc: 'From product showcases to full category pages, AffiliGrid gives you everything you need to build a stunning affiliate landing page.',
        subs: [
            { label: 'Unlimited products', text: 'Add as many affiliate links as you want with images.' },
            { label: 'Category organization', text: 'Group products so visitors find what they need fast.' },
        ],
        visual: 'storefront',
    },
    {
        title: 'Audience & Campaign',
        desc: 'Understand who is buying and which campaigns are driving the most revenue.',
        subs: [
            { label: 'Deep audience insights', text: 'See exactly where your traffic comes from geographically and demographically.' },
            { label: 'Campaign performance', text: 'Track conversions and clicks on specific marketing campaigns.' },
        ],
        visual: 'campaign',
    },
    {
        title: 'Complete Branding Control',
        desc: 'Make your storefront match your personal brand perfectly with just a few clicks.',
        subs: [
            { label: 'Theme customization', text: 'Choose your own color palette, custom fonts, and layouts.' },
            { label: 'Pixel retargeting', text: 'Add your Facebook Pixel and Google Analytics IDs in seconds.' },
        ],
        visual: 'branding',
    },
];

function VisualMockup({ type }: { type: string }) {
    if (type === 'dashboard') {
        return (
            <div
                className="block w-full h-[300px] sm:h-[450px] lg:h-full bg-cover bg-left md:bg-center bg-no-repeat transition-all duration-700 border-none bg-white min-h-[400px]"
                style={{ backgroundImage: `url('/dashboard-preview.png')` }}
                aria-label="Dashboard Preview"
            />
        );
    }
    if (type === 'storefront') {
        return (
            <div
                className="block w-full h-[300px] sm:h-[450px] lg:h-full bg-cover bg-left md:bg-center bg-no-repeat transition-all duration-700 border-none bg-white min-h-[400px]"
                style={{ backgroundImage: `url('/storefront-preview.png')` }}
                aria-label="Storefront Preview"
            />
        );
    }
    if (type === 'campaign') {
        return (
            <div
                className="block w-full h-[300px] sm:h-[450px] lg:h-full bg-cover bg-left md:bg-center bg-no-repeat transition-all duration-700 border-none bg-white min-h-[400px]"
                style={{ backgroundImage: `url('/campaign-preview.png')` }}
                aria-label="Campaign Preview"
            />
        );
    }
    if (type === 'branding') {
        return (
            <div
                className="block w-full h-[300px] sm:h-[450px] lg:h-full bg-cover bg-left md:bg-center bg-no-repeat transition-all duration-700 border-none bg-white min-h-[400px]"
                style={{ backgroundImage: `url('/branding-preview.png')` }}
                aria-label="Branding Preview"
            />
        );
    }
    return null;
}

export default function Features() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section id="features" className="py-20 md:py-32 bg-white">
            <div className="w-full mx-auto px-4 md:px-8 lg:px-12">

                {/* Header */}
                <div className="mb-16 text-center lg:text-left">
                    <span className="text-[#FF6600] text-sm font-bold uppercase tracking-[0.15em] mb-4 block">
                        Platform Built for Scale
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#111457] tracking-tight leading-[1.15]">
                        Everything you need in one space.
                    </h2>
                </div>

                {/* Main Tabs Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[600px]">

                    {/* Left Side: Navigation / List */}
                    <div className="flex flex-col gap-3 lg:w-1/3">
                        {features.map((f, i) => {
                            const isActive = activeTab === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`text-left p-6 md:p-8 rounded-2xl transition-all duration-300 border ${isActive
                                        ? 'bg-[#F9FAFB] border-gray-200 shadow-sm ring-1 ring-gray-100'
                                        : 'bg-transparent border-transparent hover:bg-gray-50'
                                        }`}
                                >
                                    <h3 className={`text-xl font-bold tracking-tight mb-2 ${isActive ? 'text-[#111457]' : 'text-gray-500'}`}>
                                        {f.title}
                                    </h3>

                                    {/* Expandable Content Area */}
                                    <div className={`grid transition-all duration-300 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
                                        <div className="overflow-hidden">
                                            <p className="text-gray-600 text-[15px] font-medium leading-relaxed mb-6">
                                                {f.desc}
                                            </p>

                                            <div className="space-y-4 mb-6">
                                                {f.subs.map((sub, j) => (
                                                    <div key={j} className="flex gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6600] mt-2 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-[14px] font-bold text-[#111457] mb-0.5">{sub.label}</div>
                                                            <div className="text-[13px] text-gray-500 leading-relaxed">{sub.text}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF6600] transition-colors">
                                                Learn more
                                                <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side: Visual Mockup */}
                    <div className="lg:w-2/3 lg:h-auto overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/40 relative bg-white">
                        {/* Wrapper for smooth crossfade transitions */}
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${activeTab === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {activeTab === i && (
                                    <VisualMockup type={f.visual} />
                                )}
                            </div>
                        ))}
                        {/* Fallback space filler if absolute positioning collapses height */}
                        <div className="invisible pointer-events-none">
                            <VisualMockup type="analytics" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
