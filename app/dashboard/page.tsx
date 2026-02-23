'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    ArrowUpRight, ShoppingBag, MousePointerClick, Zap, TrendingUp,
    Loader2, Plus, Share2, Copy, Eye, Package, BarChart3, QrCode, X, Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import OverviewChart from '@/components/dashboard/OverviewChart';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const PERIODS = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(7);
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const fetchStats = useCallback(async (p: number) => {
        try {
            const response = await api.get(`/analytics?period=${p}`);
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats(period);
    }, [period, fetchStats]);

    const handlePeriodChange = (p: number) => {
        setPeriod(p);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user?.username}` : '';

    const handleCopyLink = () => {
        if (!profileUrl) return;
        navigator.clipboard.writeText(profileUrl);
        toast.success('Link copied!');
    };

    const handleDownloadQR = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const data = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        canvas.width = 1024;
        canvas.height = 1024;

        img.onload = () => {
            ctx?.drawImage(img, 0, 0, 1024, 1024);
            const a = document.createElement('a');
            a.download = `${user?.username}-qrcode.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
        return `${base}/storage/${imagePath}`;
    };

    const statCards = [
        { name: 'Products', value: stats?.total_links || 0, icon: Package },
        { name: 'Total Clicks', value: stats?.total_clicks || 0, icon: MousePointerClick },
        { name: 'Active', value: stats?.active_links || 0, icon: Zap },
        {
            name: `Last ${period} Days`,
            value: stats?.clicks_in_period || 0,
            icon: TrendingUp
        },
    ];

    return (
        <div className="space-y-6 pb-8">

            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Store Active</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#111457] tracking-tight">
                        {greeting()}, {user?.username ? user.username : 'Dashboard'}
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1.5">Here&apos;s what&apos;s happening in your store today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 h-11 w-11 sm:w-auto sm:px-4 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 hover:text-[#111457] transition-all shadow-sm"
                        title="Copy Profile Link"
                    >
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                    </button>
                    <button
                        onClick={() => setShowQR(true)}
                        className="flex items-center justify-center h-11 w-11 bg-white text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:text-[#111457] transition-all shadow-sm"
                        title="Show QR Code"
                    >
                        <QrCode className="w-4 h-4" />
                    </button>
                    <Link
                        href="/dashboard/links/new"
                        className="flex items-center gap-2 h-11 px-5 bg-[#111457] text-white rounded-xl text-sm font-semibold hover:bg-[#0d1045] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Product
                    </Link>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
                    <div
                        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-[#111457]">Your QR Code</h3>
                            <button
                                onClick={() => setShowQR(false)}
                                className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex justify-center mb-6" ref={qrRef}>
                            <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                <QRCodeSVG
                                    value={profileUrl}
                                    size={200}
                                    level="H"
                                    bgColor="#FFFFFF"
                                    fgColor="#111457"
                                />
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-400 mb-5 break-all">
                            {profileUrl}
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleDownloadQR}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#111457] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download PNG
                            </button>
                            <button
                                onClick={() => {
                                    handleCopyLink();
                                    setShowQR(false);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 group cursor-default"
                        >
                            {/* Huge faded background icon */}
                            <Icon className="absolute -right-3 -bottom-5 w-28 h-28 text-gray-50 group-hover:scale-110 group-hover:text-gray-100 group-hover:-rotate-3 transition-all duration-500 pointer-events-none" strokeWidth={1} />

                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="mb-4">
                                    <p className="text-3xl font-extrabold text-[#111457] tracking-tight">{stat.value.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                                    <p className="text-[11px] font-bold uppercase tracking-wider">{stat.name}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chart + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-[#111457]">Traffic Overview</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Click performance</p>
                        </div>
                        {/* Period Switcher */}
                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                            {PERIODS.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => handlePeriodChange(p.value)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value
                                        ? 'bg-white text-[#111457] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <OverviewChart data={stats?.clicks_by_day || []} period={period} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-[15px] font-bold text-[#111457] mb-5">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <Link
                            href="/dashboard/links/new"
                            className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                <Plus className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#111457]">Add Product</p>
                            </div>
                        </Link>

                        <button
                            onClick={() => setShowQR(true)}
                            className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <QrCode className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#111457]">Show QR</p>
                            </div>
                        </button>

                        {user?.username && (
                            <Link
                                href={`/${user.username}`}
                                target="_blank"
                                className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                    <Eye className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#111457]">View Profile</p>
                                </div>
                            </Link>
                        )}

                        <Link
                            href="/dashboard/links"
                            className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                                <Package className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#111457]">All Products</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-[#111457]">Top Products</h3>
                    <Link
                        href="/dashboard/links"
                        className="text-xs font-medium text-gray-400 hover:text-[#111457] transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                                <th className="pb-3 font-medium w-8">#</th>
                                <th className="pb-3 font-medium pl-2">Product</th>
                                <th className="pb-3 font-medium">Clicks</th>
                                <th className="pb-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.top_links?.map((link: any, index: number) => {
                                const imageUrl = getImageUrl(link.image_path);
                                return (
                                    <tr key={link.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5">
                                            <span className="text-xs font-bold text-gray-300">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="py-3.5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={link.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingBag className="w-4 h-4 text-gray-300" />
                                                    )}
                                                </div>
                                                <p className="font-semibold text-[#111457] text-sm truncate max-w-[200px]">{link.title}</p>
                                            </div>
                                        </td>
                                        <td className="py-3.5">
                                            <span className="text-sm font-bold text-[#111457]">{link.clicks_count.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3.5 text-right">
                                            <Link
                                                href={`/dashboard/links/${link.id}/edit`}
                                                className="text-xs font-medium text-gray-400 hover:text-[#111457] transition-colors"
                                            >
                                                Edit →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!stats?.top_links || stats.top_links.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <BarChart3 className="w-6 h-6 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">No clicks yet</p>
                                        <p className="text-xs text-gray-300 mt-1">Share your products to start tracking</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
