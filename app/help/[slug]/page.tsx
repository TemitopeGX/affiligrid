'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, ChevronRight, BookOpen, Clock,
    Rocket, ShoppingBag, Mail, BarChart3, Palette, Settings,
    Store, LayoutDashboard, Package, FolderOpen, Star,
    Send, KeyRound, Megaphone, Users, Target, TrendingUp,
    Paintbrush, Link as LinkIcon, Lock, UserCircle, Server,
    Search,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getArticleBySlug, helpArticles, helpCategories, getArticlesByCategory, HelpArticle } from '@/lib/helpArticles';
import { useState, useMemo } from 'react';

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

// Markdown renderer
function renderContent(content: string) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';
    let inTable = false;
    let tableRows: string[][] = [];

    const processInline = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let remaining = text;
        let key = 0;

        while (remaining.length > 0) {
            const codeMatch = remaining.match(/`([^`]+)`/);
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
            const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

            const matches = [
                codeMatch ? { type: 'code', match: codeMatch } : null,
                boldMatch ? { type: 'bold', match: boldMatch } : null,
                !boldMatch && italicMatch ? { type: 'italic', match: italicMatch } : null,
                linkMatch ? { type: 'link', match: linkMatch } : null,
            ].filter(Boolean).sort((a, b) => (a!.match.index || 0) - (b!.match.index || 0));

            if (matches.length === 0) { parts.push(remaining); break; }

            const earliest = matches[0]!;
            const before = remaining.slice(0, earliest.match.index);
            if (before) parts.push(before);

            if (earliest.type === 'code') {
                parts.push(<code key={key++} className="px-1.5 py-0.5 bg-[#f0f0f0] text-[#d63384] rounded text-[13px] font-mono">{earliest.match[1]}</code>);
            } else if (earliest.type === 'bold') {
                parts.push(<strong key={key++} className="font-semibold text-[#111457]">{earliest.match[1]}</strong>);
            } else if (earliest.type === 'italic') {
                parts.push(<em key={key++} className="italic">{earliest.match[1]}</em>);
            } else if (earliest.type === 'link') {
                parts.push(
                    <Link key={key++} href={earliest.match[2]} className="text-[#0969da] hover:underline">
                        {earliest.match[1]}
                    </Link>
                );
            }
            remaining = remaining.slice((earliest.match.index || 0) + earliest.match[0].length);
        }
        return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Code blocks
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <div key={i} className="my-5 rounded-lg overflow-hidden border border-[#e5e5e5]">
                        {codeLang && (
                            <div className="px-4 py-2 bg-[#f5f5f5] border-b border-[#e5e5e5] text-[10px] font-bold text-[#999] uppercase tracking-wider">
                                {codeLang}
                            </div>
                        )}
                        <pre className="bg-[#fafafa] p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-[#333]">
                            <code>{codeLines.join('\n')}</code>
                        </pre>
                    </div>
                );
                codeLines = [];
                codeLang = '';
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeLang = trimmed.slice(3).trim();
            }
            continue;
        }
        if (inCodeBlock) { codeLines.push(line); continue; }

        // Tables
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (trimmed.match(/^\|[\s-|]+\|$/)) continue;
            const cells = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim());
            if (!inTable) { tableRows = [cells]; inTable = true; }
            else { tableRows.push(cells); }

            const nextLine = (lines[i + 1] || '').trim();
            if (!nextLine.startsWith('|') || nextLine.match(/^\|[\s-|]+\|$/)) {
                // Check if the next-next line is also not a table
                const nextNextLine = (lines[i + 2] || '').trim();
                if (nextLine.match(/^\|[\s-|]+\|$/) && nextNextLine.startsWith('|')) continue;

                if (nextLine.match(/^\|[\s-|]+\|$/)) continue;

                elements.push(
                    <div key={i} className="my-5 overflow-x-auto rounded-lg border border-[#e5e5e5]">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="bg-[#f5f5f5]">
                                    {tableRows[0].map((cell, ci) => (
                                        <th key={ci} className="text-left px-4 py-2.5 font-semibold text-[#333] border-b border-[#e5e5e5]">
                                            {processInline(cell)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.slice(1).map((row, ri) => (
                                    <tr key={ri} className="border-b border-[#f0f0f0] last:border-b-0">
                                        {row.map((cell, ci) => (
                                            <td key={ci} className="px-4 py-2.5 text-[#666]">
                                                {processInline(cell)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                tableRows = [];
                inTable = false;
            }
            continue;
        }

        if (trimmed === '') continue;

        // Headings
        if (trimmed.startsWith('## ')) {
            elements.push(<h2 key={i} className="text-xl font-bold text-[#111457] mt-12 mb-4 tracking-tight">{trimmed.slice(3)}</h2>);
            continue;
        }
        if (trimmed.startsWith('### ')) {
            elements.push(<h3 key={i} className="text-base font-bold text-[#111457] mt-8 mb-3">{trimmed.slice(4)}</h3>);
            continue;
        }
        if (trimmed.startsWith('#### ')) {
            elements.push(<h4 key={i} className="text-sm font-bold text-[#333] mt-6 mb-2">{trimmed.slice(5)}</h4>);
            continue;
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
            elements.push(
                <div key={i} className="border-l-2 border-[#d0d0d0] bg-[#f9f9f9] pl-4 pr-4 py-3 my-4 text-[13px] text-[#666] leading-relaxed rounded-r-lg">
                    {processInline(trimmed.slice(2))}
                </div>
            );
            continue;
        }

        // Ordered list
        if (trimmed.match(/^\d+\.\s/)) {
            const num = trimmed.match(/^(\d+)/)?.[1] || '1';
            const text = trimmed.replace(/^\d+\.\s/, '');
            elements.push(
                <div key={i} className="flex gap-3 my-1">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#111457] text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{num}</span>
                    <p className="text-[14px] text-[#444] leading-relaxed flex-1">{processInline(text)}</p>
                </div>
            );
            continue;
        }

        // Unordered list
        if (trimmed.startsWith('- ')) {
            elements.push(
                <div key={i} className="flex gap-3 my-1 pl-0.5">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-[#999] rounded-full mt-[7px]" />
                    <p className="text-[14px] text-[#444] leading-relaxed flex-1">{processInline(trimmed.slice(2))}</p>
                </div>
            );
            continue;
        }

        // Paragraph
        elements.push(
            <p key={i} className="text-[14px] text-[#444] leading-[1.8] my-3">{processInline(trimmed)}</p>
        );
    }

    return elements;
}

export default function HelpArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const article = getArticleBySlug(slug);
    const [sidebarSearch, setSidebarSearch] = useState('');

    const allSidebarArticles = useMemo(() => {
        if (!sidebarSearch) return null;
        const q = sidebarSearch.toLowerCase();
        return helpArticles.filter(a =>
            a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
        );
    }, [sidebarSearch]);

    if (!article) {
        return (
            <div className="min-h-screen bg-[#fafafa]">
                <Navbar forceSolid />
                <div className="pt-32 text-center px-6">
                    <h1 className="text-xl font-bold text-[#111457] mb-2">Article Not Found</h1>
                    <p className="text-sm text-[#999] mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/help" className="text-[#0969da] text-sm font-medium hover:underline">
                        Back to Help Center
                    </Link>
                </div>
            </div>
        );
    }

    const category = helpCategories.find(c => c.id === article.category);
    const readTime = Math.max(1, Math.round(article.content.split(/\s+/).length / 200));
    const ArticleIcon = getIcon(article.iconName);

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Navbar forceSolid />

            <div className="flex-grow flex pt-[72px]">

                {/* Sidebar */}
                <aside className="hidden lg:block w-[260px] flex-shrink-0 border-r border-[#eaeaea] bg-white overflow-y-auto sticky top-[72px] h-[calc(100vh-72px)]">
                    <div className="p-4">
                        {/* Sidebar Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
                            <input
                                type="text"
                                value={sidebarSearch}
                                onChange={e => setSidebarSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f5f5f5] border border-[#eaeaea] text-[12px] text-[#333] placeholder:text-[#999] outline-none focus:border-[#ccc] transition-colors"
                            />
                        </div>

                        {/* Search Results */}
                        {allSidebarArticles && (
                            <div className="mb-4 space-y-0.5">
                                {allSidebarArticles.length > 0 ? allSidebarArticles.map(a => (
                                    <Link
                                        key={a.slug}
                                        href={`/help/${a.slug}`}
                                        className={`block px-3 py-1.5 rounded-md text-[12px] transition-colors ${a.slug === slug ? 'bg-[#111457] text-white font-medium' : 'text-[#666] hover:text-[#111457] hover:bg-[#f5f5f5]'
                                            }`}
                                    >
                                        {a.title}
                                    </Link>
                                )) : (
                                    <p className="text-[11px] text-[#999] px-3 py-2">No results</p>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        {!allSidebarArticles && (
                            <nav className="space-y-5">
                                {helpCategories.map(cat => {
                                    const CatIcon = getIcon(cat.iconName);
                                    const articles = getArticlesByCategory(cat.id);
                                    const isActive = cat.id === article.category;
                                    return (
                                        <div key={cat.id}>
                                            <div className="flex items-center gap-2 px-2 mb-1">
                                                <CatIcon className="w-3.5 h-3.5 text-[#999]" />
                                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#111457]' : 'text-[#999]'}`}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <div className="space-y-px">
                                                {articles.map(a => (
                                                    <Link
                                                        key={a.slug}
                                                        href={`/help/${a.slug}`}
                                                        className={`block px-3 py-1.5 rounded-md text-[12px] transition-colors ${a.slug === slug
                                                            ? 'bg-[#111457] text-white font-medium'
                                                            : 'text-[#666] hover:text-[#111457] hover:bg-[#f5f5f5]'
                                                            }`}
                                                    >
                                                        {a.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </nav>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#999] mb-8">
                            <Link href="/help" className="hover:text-[#111457] transition-colors">Docs</Link>
                            <ChevronRight className="w-3 h-3" />
                            {category && (
                                <>
                                    <span className="text-[#666]">{category.name}</span>
                                    <ChevronRight className="w-3 h-3" />
                                </>
                            )}
                            <span className="text-[#111457] font-medium">{article.title}</span>
                        </div>

                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111457] tracking-tight mb-2">
                                {article.title}
                            </h1>
                            <p className="text-[14px] text-[#999]">{article.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-[11px] text-[#bbb]">
                                    <Clock className="w-3 h-3" />
                                    <span>{readTime} min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#eaeaea] pt-8">
                            {renderContent(article.content)}
                        </div>

                        {/* Navigation */}
                        <div className="mt-16 pt-8 border-t border-[#eaeaea]">
                            <NavigationLinks current={article} />
                        </div>

                        {/* Back */}
                        <div className="mt-8">
                            <Link
                                href="/help"
                                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#999] hover:text-[#111457] transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Help Center
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

function NavigationLinks({ current }: { current: HelpArticle }) {
    const currentIndex = helpArticles.findIndex(a => a.slug === current.slug);
    const prev = currentIndex > 0 ? helpArticles[currentIndex - 1] : null;
    const next = currentIndex < helpArticles.length - 1 ? helpArticles[currentIndex + 1] : null;

    return (
        <div className="grid grid-cols-2 gap-4">
            {prev ? (
                <Link href={`/help/${prev.slug}`} className="group border border-[#eaeaea] rounded-lg p-4 hover:border-[#ccc] transition-colors">
                    <p className="text-[10px] text-[#999] uppercase tracking-wider font-bold mb-1">Previous</p>
                    <p className="text-[13px] font-semibold text-[#333] group-hover:text-[#111457] transition-colors">{prev.title}</p>
                </Link>
            ) : <div />}
            {next ? (
                <Link href={`/help/${next.slug}`} className="group border border-[#eaeaea] rounded-lg p-4 hover:border-[#ccc] transition-colors text-right">
                    <p className="text-[10px] text-[#999] uppercase tracking-wider font-bold mb-1">Next</p>
                    <p className="text-[13px] font-semibold text-[#333] group-hover:text-[#111457] transition-colors">{next.title}</p>
                </Link>
            ) : <div />}
        </div>
    );
}
