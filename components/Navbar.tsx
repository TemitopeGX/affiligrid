'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar({ forceSolid = false, isPublic = false }: { forceSolid?: boolean; isPublic?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = scrolled || forceSolid;

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    if (isPublic) return null;

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isSolid
                    ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 py-3'
                    : 'bg-transparent py-5'
            )}
        >
            <div className="px-6 md:px-12 lg:px-16">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300",
                            isSolid ? "bg-[#111457]" : "bg-[#111457]"
                        )}>
                            <span className="text-white font-bold text-[11px] tracking-wider">AG</span>
                        </div>
                        <span className={cn(
                            "text-[18px] font-bold tracking-tight transition-colors duration-300 uppercase",
                            isSolid ? "text-[#111457]" : "text-[#111457]"
                        )}>
                            AffiliGrid
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors duration-300",
                                    isSolid
                                        ? "text-gray-500 hover:text-[#111457]"
                                        : "text-[#111457]/60 hover:text-[#111457]"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth */}
                    <div className="hidden md:flex items-center gap-5">
                        <Link
                            href="/login"
                            className={cn(
                                "text-sm font-medium transition-colors duration-300",
                                isSolid
                                    ? "text-gray-600 hover:text-[#111457]"
                                    : "text-[#111457]/60 hover:text-[#111457]"
                            )}
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="px-5 py-2.5 text-sm font-semibold bg-[#FF6600] text-white rounded-full hover:bg-[#e65c00] transition-all shadow-[0_4px_14px_rgba(255,102,0,0.25)]"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className={cn(
                            "md:hidden p-2 transition-colors",
                            isSolid ? "text-gray-700" : "text-[#111457]"
                        )}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl">
                    <div className="p-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="p-3 text-sm font-medium text-gray-600 hover:text-[#111457]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="my-2 border-gray-100" />
                        <Link href="/login" className="p-3 text-sm font-medium text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                            Log in
                        </Link>
                        <Link href="/signup" className="p-3 mt-1 text-center text-sm font-semibold bg-[#FF6600] text-white rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
