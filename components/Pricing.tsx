'use client';

import { Check, Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Free Forever',
        price: '0',
        period: '/mo',
        description: 'Everything you need to build your first storefront.',
        features: [
            'Unlimited affiliate links',
            'Basic traffic analytics',
            'Standard grid layout',
            'affiligrid.com/username',
        ],
        cta: 'Start for free',
        href: '/signup',
        highlighted: false,
    },
    {
        name: 'Creator Pro',
        price: '12',
        period: '/mo',
        badge: 'Most Popular',
        description: 'For serious marketers driving real conversions.',
        features: [
            'Everything in Free, plus:',
            'Deep referrer analytics (IG, TikTok)',
            'Remove AffiliGrid branding',
            'Automated email capture popups',
            'Custom color themes & fonts',
            'Add Facebook/Google tracking pixels',
            'Priority 24/7 email support',
        ],
        cta: 'Start 14-day free trial',
        href: '/signup',
        highlighted: true,
    },
    {
        name: 'Agency Hub',
        price: '49',
        period: '/mo',
        description: 'Manage links for multiple clients or brands.',
        features: [
            'Everything in Creator Pro, plus:',
            'Manage up to 10 storefronts',
            'Connect custom root domains',
            'White-label reporting dashboards',
            'Team collaboration & seats',
            'Dedicated account manager',
        ],
        cta: 'Contact Sales',
        href: '/contact',
        highlighted: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 md:py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Header Sequence */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
                    <span className="text-[#FF6600] text-sm font-bold uppercase tracking-[0.15em] mb-4 block">
                        Simple Pricing
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#111457] tracking-tight leading-[1.1] mb-6">
                        Scale your commissions, not your costs.
                    </h2>
                    <p className="text-gray-500 text-[18px] md:text-xl font-medium leading-relaxed">
                        Start building your storefront for free. Upgrade only when your audience needs more power.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative flex flex-col p-8 lg:p-10 rounded-[2rem] transition-transform duration-500 hover:-translate-y-2
                                ${plan.highlighted
                                    ? 'bg-[#111457] text-white shadow-2xl shadow-[#111457]/30 border-none scale-100 md:scale-105 z-10'
                                    : 'bg-white text-gray-900 border border-gray-200 shadow-xl shadow-gray-200/40 z-0'
                                }
                            `}
                        >
                            {/* Popular Badge */}
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 bg-[#FF6600] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                                    <Flame className="w-3.5 h-3.5 fill-current" />
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-4 ${plan.highlighted ? 'text-white' : 'text-[#111457]'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className={`text-[17px] font-bold ${plan.highlighted ? 'text-white/60' : 'text-gray-400'}`}>$</span>
                                    <span className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? 'text-white' : 'text-[#111457]'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-[15px] font-medium ${plan.highlighted ? 'text-white/60' : 'text-gray-400'}`}>
                                        {plan.period}
                                    </span>
                                </div>
                                <p className={`text-[14px] leading-relaxed font-medium min-h-[42px] ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Features Checkmarks */}
                            <div className="flex-1 flex flex-col gap-4 mb-10 pt-6 border-t border-dashed border-gray-200/20">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlighted ? 'bg-[#FF6600]/20 text-[#FF6600]' : 'bg-[#111457]/5 text-[#111457]'}`}>
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                        <span className={`text-[15px] font-medium leading-snug ${plan.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Link
                                href={plan.href}
                                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[15px] transition-all duration-300
                                    ${plan.highlighted
                                        ? 'bg-[#FF6600] text-white hover:bg-[#e65c00] hover:shadow-[0_0_20px_rgba(255,102,0,0.4)]'
                                        : 'bg-white border-2 border-gray-200 text-[#111457] hover:border-[#111457] hover:bg-gray-50'
                                    }
                                `}
                            >
                                {plan.cta}
                                {plan.highlighted && <ArrowRight className="w-4 h-4" />}
                            </Link>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
