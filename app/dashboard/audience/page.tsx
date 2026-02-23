'use client';

import { useState, useEffect } from 'react';
import { Download, Search, Users, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AudiencePage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const response = await api.get('/subscribers');
            setSubscribers(response.data);
        } catch (error) {
            console.error('Failed to load subscribers', error);
            toast.error('Failed to load audience list');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/subscribers/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Audience list exported!');
        } catch (error) {
            console.error('Export failed', error);
            toast.error('Failed to export CSV');
        }
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#111457]">Audience</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage your email subscribers and leads</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Metrics */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Subscribers</p>
                            <p className="text-xl font-bold text-[#111457]">{subscribers.length}</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-[#111457]">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 text-right">
                                            {new Date(sub.created_at).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-400">
                                        {searchQuery ? 'No subscribers found matching your search.' : 'No subscribers yet. Share your profile to get started!'}
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
