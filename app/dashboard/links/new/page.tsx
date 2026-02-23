'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Link as LinkIcon, DollarSign, Tag, Upload, Loader2, X, Plus, ChevronDown, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function NewLinkPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        price: '',
        category_id: '',
        published_at: '',
        expires_at: '',
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [gallery, setGallery] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
                toast.error('Could not load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (value: string) => {
        setFormData({ ...formData, description: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(f => f.size <= 2 * 1024 * 1024);
            if (validFiles.length !== newFiles.length) {
                toast.error('Some files were skipped (max 2MB)');
            }
            setGallery(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(f => URL.createObjectURL(f));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeGalleryImage = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setGallery(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.url) {
            toast.error('Please fill in required fields (Title and URL)');
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('url', formData.url);
            if (formData.description) data.append('description', formData.description);
            if (formData.price) data.append('price', formData.price);
            if (formData.category_id) data.append('category_id', formData.category_id);
            if (formData.published_at) data.append('published_at', formData.published_at);
            if (formData.expires_at) data.append('expires_at', formData.expires_at);
            if (file) data.append('image', file);

            gallery.forEach((gFile) => {
                data.append('gallery[]', gFile);
            });

            await api.post('/links', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Product created successfully');
            router.push('/dashboard/links');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-[#111457] placeholder:text-gray-300 outline-none focus:bg-white focus:border-gray-200 transition-all";
    const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";

    return (
        <div className="pb-8">


            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/links"
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#111457]">New Product</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Create a new product for your store</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/links"
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

                {/* Left Column — Form */}
                <div className="space-y-5 min-w-0">

                    {/* Product Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-[#111457] mb-4">Product Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Title <span className="text-red-400">*</span></label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <div className="rounded-xl overflow-hidden bg-white">
                                    <RichTextEditor
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Enter product description..."
                                        minHeight="200px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link & Pricing */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-[#111457] mb-4">Link & Pricing</h2>

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Affiliate URL <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        type="url"
                                        placeholder="https://example.com/product"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Price</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarClock className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-[#111457]">Scheduling</h2>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Set dates to auto-publish and auto-expire this product. Leave blank for always visible.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Publish Date</label>
                                <input
                                    name="published_at"
                                    value={formData.published_at}
                                    onChange={handleChange}
                                    type="datetime-local"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Expiry Date</label>
                                <input
                                    name="expires_at"
                                    value={formData.expires_at}
                                    onChange={handleChange}
                                    type="datetime-local"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                </div> {/* Closes Left Column — Form */}

                {/* Right Column — Images */}
                <div className="space-y-5 min-w-0">

                    {/* Main Image */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-[#111457] mb-4">Main Image</h2>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative rounded-xl h-56 flex flex-col items-center justify-center text-center cursor-pointer group overflow-hidden transition-all ${preview
                                ? 'bg-gray-50 border border-gray-100'
                                : 'border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-3" />
                                    <button
                                        onClick={removeFile}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-100 text-gray-400 rounded-lg flex items-center justify-center shadow-sm hover:text-red-500 hover:border-red-200 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors">
                                        <Upload className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">Click to upload</p>
                                    <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 2MB</p>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-[#111457] mb-4">Gallery</h2>

                        <div className="grid grid-cols-3 gap-2">
                            {galleryPreviews.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                                    <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => removeGalleryImage(e, idx)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-white border border-gray-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:text-red-500 hover:border-red-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <div
                                onClick={() => galleryInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                <Plus className="w-5 h-5 text-gray-300" />
                                <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Save */}
                    <div className="lg:hidden flex gap-3">
                        <Link
                            href="/dashboard/links"
                            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 text-center border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-[#111457] text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isLoading ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
