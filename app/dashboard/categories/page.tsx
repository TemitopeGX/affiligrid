'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Layers, Loader2, X, Check } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const response = await api.post('/categories', { name: newCategoryName });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
            setIsCreating(false);
            toast.success('Category created');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create category');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this category?')) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
            toast.success('Category deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete');
        }
    };

    const startEditing = (category: any) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const handleUpdate = async () => {
        if (!editingName.trim() || !editingId) return;

        try {
            await api.put(`/categories/${editingId}`, { name: editingName });
            setCategories(categories.map(c =>
                c.id === editingId ? { ...c, name: editingName } : c
            ));
            setEditingId(null);
            setEditingName('');
            toast.success('Category updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#111457]">Categories</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{categories.length} categories · Organize your products</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Category
                </button>
            </div>

            {/* Search */}
            {categories.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-100 text-sm text-[#111457] placeholder:text-gray-300 focus:outline-none focus:border-gray-200 transition-colors"
                    />
                </div>
            )}

            {/* Create Inline */}
            {isCreating && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">New category</p>
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            type="text"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#111457] placeholder:text-gray-300 focus:outline-none focus:border-[#111457] transition-colors"
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <button
                            onClick={handleCreate}
                            className="p-2.5 rounded-xl bg-[#111457] text-white hover:bg-[#0d1045] transition-colors"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setIsCreating(false); setNewCategoryName(''); }}
                            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            {filteredCategories.length === 0 && !isCreating ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Layers className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No categories yet</p>
                    <p className="text-xs text-gray-300 mt-1">Create one to organize your products</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center gap-4 px-5 py-4 group hover:bg-gray-50/50 transition-colors"
                        >
                            {/* Icon */}
                            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-4 h-4 text-gray-400" />
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                {editingId === category.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#111457] focus:outline-none focus:border-[#111457] transition-colors"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdate();
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                        />
                                        <button
                                            onClick={handleUpdate}
                                            className="p-1.5 rounded-lg bg-[#111457] text-white hover:bg-[#0d1045] transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-[#111457] truncate">{category.name}</p>
                                )}
                            </div>

                            {/* Count */}
                            <span className="text-xs text-gray-400 font-medium tabular-nums flex-shrink-0">
                                {category.links_count || 0} products
                            </span>

                            {/* Actions */}
                            {editingId !== category.id && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                        onClick={() => startEditing(category)}
                                        className="p-1.5 rounded-lg text-gray-300 hover:text-[#111457] hover:bg-gray-100 transition-colors"
                                        title="Rename"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
