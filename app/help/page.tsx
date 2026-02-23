'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, ChevronRight, ArrowRight, BookOpen,
    Rocket, ShoppingBag, Mail, BarChart3, Palette, Settings,
    Store, LayoutDashboard, Package, FolderOpen, Star,
    Send, KeyRound, Megaphone, Users, Target, TrendingUp,
    Paintbrush, Link as LinkIcon, Lock, UserCircle, Server,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { helpCategories, helpArticles, getArticlesByCategory } from '@/lib/helpArticles';

// Icon map
const iconMap: Record<string, React.ElementType> = {
    Rocket, ShoppingBag, Mail, BarChart3, Palette, Settings,
    Store, LayoutDashboard, Package, FolderOpen, Star,
    Send, KeyRound, Megaphone, Users, Target, TrendingUp,
    Paintbrush, Link: LinkIcon, Lock, UserCircle, Server,
    BookOpen,
};

function getIcon(name: string) {
    return iconMap[name] || BookOpen;
}

export default function HelpCenterPage() {
    const [search, setSearch] = useState('');

    const filteredArticles = useMemo(() => {
        if (search.length < 2) return [];
        const q = search.toLowerCase();
        return helpArticles.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Navbar forceSolid />

            {/* Hero */}
            <section className="relative pt-28 pb-14 px-6 bg-[#111457] border-b border-[#1a1c6b]">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-[11px] font-bold text-indigo-300/70 uppercase tracking-[0.15em] mb-4">
                        Documentation
                    </p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                        Help Center
                    </h1>
                    <p className="text-[15px] text-indigo-200/60 mb-10 max-w-lg mx-auto leading-relaxed">
                        Learn how to set up, manage, and grow your store with AffiliGrid.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search documentation..."
                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-[#0d1045] border border-[#252880] text-sm text-white placeholder:text-indigo-300/40 outline-none focus:border-indigo-400/40 transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-indigo-300/50 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                Clear
                            </button>
                        )}

                        {/* Search Dropdown */}
                        {search.length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1045] border border-[#252880] rounded-xl overflow-hidden shadow-2xl shadow-black/40 z-50">
                                {filteredArticles.length > 0 ? (
                                    <div className="max-h-[340px] overflow-y-auto">
                                        {filteredArticles.map(article => {
                                            const Icon = getIcon(article.iconName);
                                            return (
                                                <Link
                                                    key={article.slug}
                                                    href={`/help/${article.slug}`}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#161966] transition-colors border-b border-[#1a1c6b] last:border-b-0"
                                                >
                                                    <Icon className="w-4 h-4 text-indigo-300/50 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-indigo-100 truncate">{article.title}</p>
                                                        <p className="text-[11px] text-indigo-300/50 truncate">{article.description}</p>
                                                    </div>
                                                    <ChevronRight className="w-3.5 h-3.5 text-indigo-300/30 flex-shrink-0" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-sm text-indigo-200/60">No results for &quot;{search}&quot;</p>
                                        <p className="text-[11px] text-indigo-300/40 mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="flex-grow py-16 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden mb-20 border border-gray-200">
                        {helpCategories.map(cat => {
                            const CatIcon = getIcon(cat.iconName);
                            const articles = getArticlesByCategory(cat.id);
                            return (
                                <div key={cat.id} className="bg-white p-6 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center border border-gray-100 group-hover:bg-[#111457] group-hover:border-[#111457] transition-colors">
                                            <CatIcon className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h2 className="text-[13px] font-bold text-[#111457]">{cat.name}</h2>
                                            <p className="text-[11px] text-[#999]">{articles.length} articles</p>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        {articles.map(article => (
                                            <Link
                                                key={article.slug}
                                                href={`/help/${article.slug}`}
                                                className="flex items-center gap-2 py-1.5 text-[13px] text-[#666] hover:text-[#111457] transition-colors group/link"
                                            >
                                                <span className="flex-1 truncate">{article.title}</span>
                                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Popular Articles */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-[#111457] mb-1">Popular Articles</h2>
                        <p className="text-sm text-[#999]">Most frequently visited guides</p>
                    </div>

                    <div className="space-y-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
                        {[
                            'create-your-store',
                            'setup-gmail-app-password',
                            'setup-email-campaigns',
                            'setup-tracking-pixels',
                            'customize-store-theme',
                            'custom-smtp-setup',
                        ].map(slug => {
                            const article = helpArticles.find(a => a.slug === slug);
                            if (!article) return null;
                            const Icon = getIcon(article.iconName);
                            const cat = helpCategories.find(c => c.id === article.category);
                            return (
                                <Link
                                    key={slug}
                                    href={`/help/${slug}`}
                                    className="flex items-center gap-4 bg-white px-6 py-4 hover:bg-[#fafafa] transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#111457] group-hover:border-[#111457] transition-colors">
                                        <Icon className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-[#111457] group-hover:text-[#111457]">{article.title}</p>
                                        <p className="text-[11px] text-[#999] truncate">{article.description}</p>
                                    </div>
                                    {cat && (
                                        <span className="hidden sm:inline text-[10px] font-semibold text-[#999] uppercase tracking-wider bg-[#f5f5f5] px-2.5 py-1 rounded-md flex-shrink-0">
                                            {cat.name}
                                        </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#666] transition-colors flex-shrink-0" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Contact */}
                    <div className="mt-20 text-center border border-gray-200 rounded-2xl py-12 px-8 bg-white">
                        <h2 className="text-lg font-bold text-[#111457] mb-2">Can&apos;t find what you need?</h2>
                        <p className="text-sm text-[#999] mb-6 max-w-sm mx-auto">
                            Our support team is available to help you with any questions.
                        </p>
                        <a
                            href="mailto:support@affiligrid.com"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111457] text-white rounded-lg text-sm font-medium hover:bg-[#1a1c6b] transition-colors"
                        >
                            Contact Support
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
