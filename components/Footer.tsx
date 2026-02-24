'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Instagram, Linkedin, Github, ArrowRight } from 'lucide-react';

export default function Footer({ isPublic = false }: { isPublic?: boolean }) {
    if (isPublic) return null;

    return (
        <footer className="bg-[#050505] font-sans pt-24 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

                {/* Embedded CTA Section */}
                <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        Ready to launch your storefront?
                    </h2>
                    <p className="text-[#888888] text-[17px] font-medium max-w-xl mb-10 leading-relaxed">
                        Join modern affiliate marketers using AffiliGrid to centralize their links, track conversions, and own their audience natively.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/signup"
                            className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-[15px] font-bold hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            Start building for free
                        </Link>
                        <Link
                            href="#pricing"
                            className="flex items-center gap-2 bg-transparent text-white border border-white/20 px-8 py-4 rounded-full text-[15px] font-bold hover:bg-white/5 transition-colors"
                        >
                            View pricing plans
                        </Link>
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 border-t border-white/10 pt-16 mb-16">

                    {/* Brand & Mission */}
                    <div className="lg:w-1/3 flex flex-col items-start">
                        <div className="flex items-center mb-6">
                            <Image
                                src="/logo-white.png"
                                alt="AffiliGrid Icon"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-[#888888] text-[15px] leading-relaxed max-w-[300px] font-medium">
                            A highly-crafted, conversion-driven platform for global affiliate marketers.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:w-2/3 flex flex-row flex-wrap md:flex-nowrap justify-start lg:justify-end gap-16 md:gap-24">

                        <div className="flex flex-col gap-5">
                            <h4 className="text-white text-[14px] font-semibold tracking-wide">Platform</h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'How it works', href: '#how-it-works' },
                                    { label: 'Features', href: '#features' },
                                    { label: 'Changelog', href: '#changelog' },
                                    { label: 'Pricing', href: '#pricing' }
                                ].map((link) => (
                                    <Link key={link.label} href={link.href} className="text-[#888888] text-[15px] font-medium hover:text-white transition-colors block w-fit">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h4 className="text-white text-[14px] font-semibold tracking-wide">Resources</h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'Help Center', href: '#' },
                                    { label: 'API Documentation', href: '#' },
                                    { label: 'Community', href: '#' },
                                    { label: 'System Status', href: '#' }
                                ].map((link) => (
                                    <Link key={link.label} href={link.href} className="text-[#888888] text-[15px] font-medium hover:text-white transition-colors block w-fit">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h4 className="text-white text-[14px] font-semibold tracking-wide">Company</h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'About Us', href: '#' },
                                    { label: 'Careers', href: '#' },
                                    { label: 'Privacy Policy', href: '#' },
                                    { label: 'Terms of Service', href: '#' }
                                ].map((link) => (
                                    <Link key={link.label} href={link.href} className="text-[#888888] text-[15px] font-medium hover:text-white transition-colors block w-fit">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar: Copyright & Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
                    <p className="text-[#666666] text-[14px] font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} AffiliGrid Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {[
                            { icon: Twitter, href: '#' },
                            { icon: Github, href: '#' },
                            { icon: Instagram, href: '#' },
                            { icon: Linkedin, href: '#' },
                        ].map((social, i) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/10 text-[#888888] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    <Icon className="w-[16px] h-[16px]" />
                                </a>
                            );
                        })}
                    </div>
                </div>

            </div>
        </footer>
    );
}
