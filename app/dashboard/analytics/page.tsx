'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    MousePointerClick, Zap, Package, Loader2, Globe, Link2, BarChart3, Download, FileDown
} from 'lucide-react';
import OverviewChart from '@/components/dashboard/OverviewChart';
import api from '@/lib/axios';
import { toast } from 'sonner';

const PERIODS = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
];

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(7);
    const [exporting, setExporting] = useState(false);

    const fetchStats = useCallback(async (p: number) => {
        try {
            const response = await api.get(`/analytics?period=${p}`);
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats(period);
    }, [period, fetchStats]);

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const response = await api.get(`/analytics/export?period=${period}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `affiligrid-analytics-${period}d.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            toast.success('Analytics exported!');
        } catch (error) {
            console.error('Export failed', error);
            toast.error('Failed to export analytics');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Clicks', value: stats?.total_clicks || 0, sub: 'All time', icon: MousePointerClick },
        { name: `Clicks (${period}d)`, value: stats?.clicks_in_period || 0, sub: `Last ${period} days`, icon: BarChart3 },
        { name: 'Total Products', value: stats?.total_links || 0, sub: 'All products', icon: Package },
        { name: 'Active Products', value: stats?.active_links || 0, sub: 'Currently live', icon: Zap },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#111457]">Analytics</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Track performance across your affiliate links</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Export CSV */}
                    <button
                        onClick={handleExportCSV}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {exporting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <FileDown className="w-3.5 h-3.5" />
                        )}
                        Export CSV
                    </button>
                    {/* Period Switcher */}
                    <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1">
                        {PERIODS.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${period === p.value
                                    ? 'bg-[#111457] text-white'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-2xl font-bold text-[#111457] mb-0.5">{stat.value.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 font-medium">{stat.name}</p>
                        </div>
                    );
                })}
            </div>

            {/* Traffic Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-[#111457]">Clicks Over Time</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Last {period} days</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#111457]"></span>
                        <span className="text-xs text-gray-400">Clicks</span>
                    </div>
                </div>
                <OverviewChart data={stats?.clicks_by_day || []} period={period} />
            </div>

            {/* Bottom Grid: Referrers + Top Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Referrers */}
                <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h3 className="text-sm font-bold text-[#111457]">Top Referrers</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Where your traffic comes from</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats?.top_referrers?.length > 0 ? (
                            stats.top_referrers.map((item: any, i: number) => {
                                const maxCount = stats.top_referrers[0]?.count || 1;
                                const percentage = Math.round((item.count / maxCount) * 100);
                                return (
                                    <div key={i} className="px-6 py-4 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                            <Link2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#111457] truncate">
                                                {item.referrer || 'Direct / Unknown'}
                                            </p>
                                            <div className="mt-1.5 h-1 bg-gray-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#111457] rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-[#111457] tabular-nums flex-shrink-0">
                                            {item.count}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <Link2 className="w-6 h-6 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No referrer data yet</p>
                                <p className="text-xs text-gray-300 mt-1">Start sharing your links to see traffic sources</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h3 className="text-sm font-bold text-[#111457]">Top Countries</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Geographic distribution</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats?.top_countries?.length > 0 ? (
                            stats.top_countries.map((item: any, i: number) => {
                                const maxCount = stats.top_countries[0]?.count || 1;
                                const percentage = Math.round((item.count / maxCount) * 100);
                                return (
                                    <div key={i} className="px-6 py-4 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#111457] truncate">
                                                {item.country || 'Unknown'}
                                            </p>
                                            <div className="mt-1.5 h-1 bg-gray-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#111457] rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-[#111457] tabular-nums flex-shrink-0">
                                            {item.count}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <Globe className="w-6 h-6 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No location data yet</p>
                                <p className="text-xs text-gray-300 mt-1">Country data will appear as your links get clicks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
