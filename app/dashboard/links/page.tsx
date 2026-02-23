'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, ExternalLink, Pencil, Trash2,
    ShoppingBag, BarChart3, ImageIcon, Loader2, Filter, Clock, Calendar
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function LinksPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [links, setLinks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [linksRes, catsRes] = await Promise.all([
                api.get('/links'),
                api.get('/categories'),
            ]);
            setLinks(linksRes.data);
            setCategories(catsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/links/${id}`);
            setLinks(links.filter(link => link.id !== id));
            toast.success('Product deleted');
        } catch (error) {
            console.error('Failed to delete', error);
            toast.error('Failed to delete product');
        }
    };

    const getScheduleStatus = (link: any) => {
        const now = new Date();
        if (link.published_at && new Date(link.published_at) > now) return 'scheduled';
        if (link.expires_at && new Date(link.expires_at) < now) return 'expired';
        if (!link.is_active) return 'inactive';
        return 'active';
    };

    const filteredLinks = links.filter(link => {
        const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.url.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory === 'uncategorized' ? !link.category_id : String(link.category_id) === selectedCategory);

        const schedule = getScheduleStatus(link);
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && schedule === 'active') ||
            (statusFilter === 'inactive' && (schedule === 'inactive' || schedule === 'expired')) ||
            (statusFilter === 'scheduled' && schedule === 'scheduled');

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getImageUrl = (path: string) =>
        path ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}` : null;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const activeCount = links.filter(l => getScheduleStatus(l) === 'active').length;
    const scheduledCount = links.filter(l => getScheduleStatus(l) === 'scheduled').length;

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#111457]">Products</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {links.length} total · {activeCount} active
                        {scheduledCount > 0 && ` · ${scheduledCount} scheduled`}
                    </p>
                </div>
                <Link
                    href="/dashboard/links/new"
                    className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-100 text-sm text-[#111457] placeholder:text-gray-300 focus:outline-none focus:border-gray-200 transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 rounded-xl bg-white border border-gray-100 text-sm text-[#111457] focus:outline-none focus:border-gray-200 transition-colors cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        <option value="uncategorized">Uncategorized</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1">
                    {[
                        { label: 'All', value: 'all' },
                        { label: 'Active', value: 'active' },
                        { label: 'Scheduled', value: 'scheduled' },
                        { label: 'Inactive', value: 'inactive' },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === f.value
                                    ? 'bg-[#111457] text-white'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {filteredLinks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <ShoppingBag className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No products found</p>
                    <p className="text-xs text-gray-300 mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredLinks.map((link) => {
                        const imageUrl = getImageUrl(link.image_path);
                        const hostname = (() => {
                            try { return new URL(link.url).hostname.replace('www.', ''); } catch { return link.url; }
                        })();
                        const schedule = getScheduleStatus(link);

                        return (
                            <div
                                key={link.id}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-200 flex flex-col"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] bg-gray-50 relative flex items-center justify-center overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={link.title}
                                            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-200" />
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        {schedule === 'scheduled' ? (
                                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                <Clock className="w-3 h-3" />
                                                Scheduled
                                            </div>
                                        ) : schedule === 'expired' ? (
                                            <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                <Calendar className="w-3 h-3" />
                                                Expired
                                            </div>
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${link.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        )}
                                    </div>

                                    {/* Clicks */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] font-bold text-[#111457]">
                                        <BarChart3 className="w-3 h-3 text-gray-400" />
                                        {link.clicks_count.toLocaleString()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <p className="text-[11px] text-gray-300 font-medium truncate mb-1">{hostname}</p>
                                    <h3 className="font-semibold text-[#111457] text-sm leading-snug line-clamp-2 mb-1" title={link.title}>
                                        {link.title}
                                    </h3>

                                    {/* Schedule dates */}
                                    {(link.published_at || link.expires_at) && (
                                        <p className="text-[10px] text-gray-300 mb-2">
                                            {link.published_at && `From ${new Date(link.published_at).toLocaleDateString()}`}
                                            {link.published_at && link.expires_at && ' · '}
                                            {link.expires_at && `Until ${new Date(link.expires_at).toLocaleDateString()}`}
                                        </p>
                                    )}

                                    {/* Category */}
                                    {link.category && (
                                        <span className="inline-block text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md w-fit mb-2">
                                            {link.category.name}
                                        </span>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-auto flex items-center gap-1.5 pt-3 border-t border-gray-50">
                                        <Link
                                            href={`/dashboard/links/${link.id}/edit`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 text-xs font-medium text-gray-500 hover:bg-[#111457] hover:text-white transition-colors"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="p-2 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-[#111457] transition-colors"
                                            title="Visit Link"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
