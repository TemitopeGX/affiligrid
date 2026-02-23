'use client';

import { useEffect, useState } from 'react';
import { Loader2, Star, ShoppingBag, Globe, ArrowLeft, ExternalLink, ChevronRight, Shield, Truck, RotateCcw, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check, Mail, Send, X } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import AppPixelTracker from '@/components/AppPixelTracker';
import { useAuth } from '@/context/AuthContext';

const loadFont = (font: string) => {
    if (typeof document === 'undefined' || !font || font === 'Inter') return;
    const id = `gfont-${font.replace(/\s/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s/g, '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
};

const isDarkColor = (hex: string) => {
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    } catch {
        return false;
    }
};

export default function ProductClient({ username, slug, product: initialProduct, stats: initialStats, reviews: initialReviews, store }: any) {
    const [product, setProduct] = useState<any>(initialProduct);
    const [stats, setStats] = useState(initialStats);
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    const [themeSettings, setThemeSettings] = useState<any>(store?.theme_settings || null);
    const [activeImage, setActiveImage] = useState<string | null>(initialProduct?.image_path || null);
    const [copied, setCopied] = useState(false);

    const { user } = useAuth();
    const isOwner = user?.username === username;

    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewer_name: '', comment: '' });
    const [submitting, setSubmitting] = useState(false);

    // Newsletter State
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterSubject, setNewsletterSubject] = useState(`New Product: ${initialProduct?.title}`);
    const [sendingNewsletter, setSendingNewsletter] = useState(false);

    useEffect(() => {
        if (themeSettings?.font) loadFont(themeSettings.font);
    }, [themeSettings?.font]);

    const handleVisitSite = async () => {
        if (!product) return;
        try {
            await api.post(`/links/${product.id}/click`, {
                referrer: document.referrer || null,
            });
        } catch (e) {
            console.error('Failed to track click', e);
        }
        window.open(product.url, '_blank');
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.post(`/products/${username}/${slug}/reviews`, reviewForm);
            setReviews([response.data, ...reviews]);
            setReviewForm({ rating: 5, reviewer_name: '', comment: '' });
            toast.success('Review submitted!');
            setStats((prev: any) => ({
                ...prev,
                reviews_count: prev.reviews_count + 1
            }));
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBroadcastProduct = async () => {
        setSendingNewsletter(true);
        try {
            const productUrl = typeof window !== 'undefined' ? window.location.href : '';
            const imgHtml = mainImageUrl ? `<img src="${mainImageUrl}" alt="${product?.title}" style="max-width:100%;border-radius:12px;margin:20px 0;width:100%;object-fit:cover;aspect-ratio:16/9;" />` : '';
            const priceHtml = product?.price ? `<p style="font-size:24px;font-weight:bold;margin:20px 0;color:#111;">$${Number(product.price).toLocaleString()}</p>` : '';

            const bodyHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #111; margin-bottom: 8px;">Check out my new product: ${product?.title}</h2>
                    <p style="color: #555; font-size: 16px;">I just added a new product to my store!</p>
                    ${imgHtml}
                    ${priceHtml}
                    <div style="color: #444; line-height: 1.6; margin-bottom: 30px;">
                        ${product?.description || ''}
                    </div>
                    <a href="${productUrl}" style="display:inline-block;padding:14px 28px;background-color:#111457;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">View Product</a>
                </div>
            `;

            // Create campaign
            const campaignRes = await api.post('/campaigns', {
                subject: newsletterSubject,
                body: bodyHtml
            });

            // Send campaign immediately
            const sendRes = await api.post(`/campaigns/${campaignRes.data.id}/send`);

            toast.success(sendRes.data.message || 'Product broadcasted to subscribers!');
            setShowNewsletterModal(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to broadcast product');
        } finally {
            setSendingNewsletter(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-400">
                <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                <h1 className="text-lg font-bold text-gray-800 mb-1">Product Not Found</h1>
                <p className="text-sm text-gray-400 mb-4">This product may have been removed or doesn't exist.</p>
                <Link href={`/${username}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    ← Back to Store
                </Link>
            </div>
        );
    }

    // Theme
    const ts = {
        background_color: '#FFFFFF',
        text_color: '#111111',
        button_color: '#111111',
        button_text_color: '#FFFFFF',
        font: 'Inter',
        show_branding: true,
        ...(themeSettings || {}),
    };

    const bgIsDark = isDarkColor(ts.background_color);
    const subtleColor = bgIsDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
    const mutedColor = bgIsDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
    const cardBg = bgIsDark ? 'rgba(255,255,255,0.04)' : '#FAFAFA';
    const cardBorder = bgIsDark ? 'rgba(255,255,255,0.08)' : '#F0F0F0';
    const inputBg = bgIsDark ? 'rgba(255,255,255,0.06)' : '#F5F5F5';
    const dividerColor = bgIsDark ? 'rgba(255,255,255,0.06)' : '#EBEBEB';
    const starColor = '#F59E0B';

    const getImageUrl = (path: string) =>
        path ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}` : null;

    const mainImageUrl = activeImage ? getImageUrl(activeImage) : null;
    const galleryImages = [
        { id: 'main', image_path: product.image_path },
        ...(product.images || [])
    ].filter((img: any) => img.image_path);

    const getShareText = () => {
        const title = product.title;
        const price = product.price ? `($${Number(product.price).toLocaleString()})` : '';

        let desc = '';
        if (product.description) {
            const div = document.createElement('div');
            div.innerHTML = product.description;
            const plainText = div.textContent || div.innerText || '';
            desc = plainText.trim().replace(/\s+/g, ' ').slice(0, 100) + (plainText.length > 100 ? '...' : '');
        }

        const url = typeof window !== 'undefined' ? window.location.href : '';

        return `${title} ${price}\n${desc}\n${url}`;
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: ts.background_color,
                fontFamily: ts.font + ', sans-serif',
                color: ts.text_color,
            }}
        >
            <AppPixelTracker
                fbPixelId={store?.facebook_pixel_id}
                gaId={store?.google_analytics_id}
            />
            {/* Minimal Nav */}
            <nav
                className="sticky top-0 z-50 backdrop-blur-md"
                style={{
                    backgroundColor: bgIsDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
                    borderBottom: `1px solid ${dividerColor}`,
                }}
            >
                <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
                    <Link
                        href={`/${username}`}
                        className="flex items-center gap-2 text-sm font-medium transition-all hover:opacity-70"
                        style={{ color: mutedColor }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Store</span>
                    </Link>
                    <span className="text-xs font-semibold tracking-wide" style={{ color: subtleColor }}>
                        @{username}
                    </span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-5 py-10 md:py-16">

                {/* Product Hero — Two Column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* Left: Images */}
                    <div className="space-y-4">
                        <div
                            className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                        >
                            {mainImageUrl ? (
                                <img
                                    src={mainImageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-contain p-6 md:p-10"
                                />
                            ) : (
                                <ShoppingBag className="w-20 h-20 opacity-10" style={{ color: ts.text_color }} />
                            )}
                        </div>

                        {galleryImages.length > 1 && (
                            <div className="flex gap-2.5 overflow-x-auto pb-1">
                                {galleryImages.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img.image_path)}
                                        className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all"
                                        style={{
                                            backgroundColor: cardBg,
                                            border: activeImage === img.image_path
                                                ? `2px solid ${ts.button_color}`
                                                : `1px solid ${cardBorder}`,
                                            opacity: activeImage === img.image_path ? 1 : 0.6,
                                        }}
                                    >
                                        <img src={getImageUrl(img.image_path) || ''} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col justify-center">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs mb-5" style={{ color: subtleColor }}>
                            <Link href={`/${username}`} className="hover:opacity-70 transition-opacity">Store</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="truncate" style={{ color: mutedColor }}>{product.title}</span>
                        </div>

                        <h1
                            className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-3"
                            style={{ color: ts.text_color }}
                        >
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star
                                        key={s}
                                        className="w-4 h-4"
                                        style={{
                                            fill: s <= Math.round(stats.avg_rating) ? starColor : 'transparent',
                                            color: s <= Math.round(stats.avg_rating) ? starColor : cardBorder,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium" style={{ color: mutedColor }}>
                                {stats.avg_rating || '0.0'} ({stats.reviews_count})
                            </span>
                        </div>

                        {/* Price */}
                        <div
                            className="pb-6 mb-6"
                            style={{ borderBottom: `1px solid ${dividerColor}` }}
                        >
                            <div className="text-3xl font-bold tracking-tight" style={{ color: ts.text_color }}>
                                ${Number(product.price || 0).toLocaleString()}
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleVisitSite}
                            className="w-full py-4 px-6 font-semibold text-base transition-all flex items-center justify-center gap-2.5 rounded-xl hover:opacity-90 active:scale-[0.98]"
                            style={{
                                backgroundColor: ts.button_color,
                                color: ts.button_text_color,
                            }}
                        >
                            Visit Website
                            <ExternalLink className="w-4 h-4" />
                        </button>

                        <p className="text-center text-xs mt-3 flex items-center justify-center gap-1.5" style={{ color: subtleColor }}>
                            <Globe className="w-3 h-3" />
                            Opens in a new tab
                        </p>

                        {/* Share */}
                        <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: subtleColor }}>Share this product</p>
                            <div className="flex items-center gap-2">
                                {[
                                    { icon: Twitter, color: '#1DA1F2', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank') },
                                    { icon: Facebook, color: '#4267B2', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank') },
                                    { icon: Linkedin, color: '#0077b5', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank') },
                                    { icon: MessageCircle, color: '#25D366', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank') },
                                    {
                                        icon: copied ? Check : Copy, color: ts.text_color, action: () => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setCopied(true);
                                            toast.success('Link copied!');
                                            setTimeout(() => setCopied(false), 2000);
                                        }
                                    },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={i}
                                            onClick={item.action}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                            style={{
                                                backgroundColor: cardBg,
                                                border: `1px solid ${cardBorder}`,
                                                color: item.color === ts.text_color ? ts.text_color : item.color
                                            }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Owner Controls */}
                        {isOwner && (
                            <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${dividerColor}` }}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111457]">Store Owner Actions</p>
                                <button
                                    onClick={() => setShowNewsletterModal(true)}
                                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                                >
                                    <Mail className="w-4 h-4" />
                                    Broadcast to Newsletter
                                    <Send className="w-4 h-4 ml-0.5 opacity-50" />
                                </button>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div
                            className="mt-8 pt-6 grid grid-cols-3 gap-4"
                            style={{ borderTop: `1px solid ${dividerColor}` }}
                        >
                            {[
                                { icon: Shield, label: 'Verified Link' },
                                { icon: Truck, label: 'Direct Source' },
                                { icon: RotateCcw, label: 'Always Updated' },
                            ].map(({ icon: Icon, label }, i) => (
                                <div key={i} className="text-center">
                                    <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: subtleColor }} />
                                    <span className="text-[10px] font-medium leading-tight block" style={{ color: subtleColor }}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div className="mt-16 md:mt-20">
                        <h3
                            className="text-lg font-bold mb-6 flex items-center gap-4"
                            style={{ color: ts.text_color }}
                        >
                            About this product
                            <div className="h-px flex-1" style={{ backgroundColor: dividerColor }} />
                        </h3>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .themed-desc,
                            .themed-desc * {
                                color: ${bgIsDark ? 'rgba(255,255,255,0.8)' : ts.text_color} !important;
                                background-color: transparent !important;
                            }
                            .themed-desc h1, .themed-desc h2, .themed-desc h3,
                            .themed-desc h4, .themed-desc h5, .themed-desc h6,
                            .themed-desc strong, .themed-desc b {
                                color: ${ts.text_color} !important;
                                font-weight: 700;
                            }
                            .themed-desc a {
                                color: ${ts.button_color} !important;
                                text-decoration: underline;
                            }
                            .themed-desc table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 1rem 0;
                                border-radius: 8px;
                                overflow: hidden;
                            }
                            .themed-desc th, .themed-desc td {
                                padding: 0.75rem 1rem;
                                border: 1px solid ${cardBorder} !important;
                                text-align: left;
                            }
                            .themed-desc th {
                                background-color: ${bgIsDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6'} !important;
                                font-weight: 700;
                                color: ${ts.text_color} !important;
                            }
                            .themed-desc td {
                                background-color: ${bgIsDark ? 'rgba(255,255,255,0.02)' : 'transparent'} !important;
                            }
                            .themed-desc ul, .themed-desc ol {
                                padding-left: 1.5rem;
                                margin: 0.75rem 0;
                            }
                            .themed-desc li {
                                margin-bottom: 0.5rem;
                                line-height: 1.8;
                            }
                            .themed-desc li::marker {
                                color: ${bgIsDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} !important;
                            }
                            .themed-desc p {
                                margin: 0.75rem 0;
                                line-height: 1.8;
                            }
                            .themed-desc img {
                                border-radius: 0.75rem;
                                max-width: 100%;
                            }
                            .themed-desc blockquote {
                                border-left: 3px solid ${ts.button_color};
                                padding-left: 1rem;
                                margin: 1rem 0;
                                font-style: italic;
                                opacity: 0.8;
                            }
                        ` }} />
                        <div
                            className="themed-desc max-w-none break-words text-[15px] leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: product.description
                                    .replace(/style\s*=\s*"[^"]*"/gi, '')
                                    .replace(/style\s*=\s*'[^']*'/gi, '')
                            }}
                        />
                    </div>
                )}

                {/* Reviews Section */}
                <div className="mt-16 md:mt-20 pt-12" style={{ borderTop: `1px solid ${dividerColor}` }}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold" style={{ color: ts.text_color }}>
                            Reviews
                            <span className="text-sm font-normal ml-2" style={{ color: subtleColor }}>
                                ({stats.reviews_count})
                            </span>
                        </h2>
                        {stats.avg_rating > 0 && (
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" style={{ fill: starColor, color: starColor }} />
                                <span className="text-sm font-bold" style={{ color: ts.text_color }}>
                                    {stats.avg_rating}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Reviews List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.length === 0 ? (
                            <div
                                className="col-span-full text-center py-12 rounded-2xl"
                                style={{ backgroundColor: cardBg, border: `1px dashed ${cardBorder}` }}
                            >
                                <p className="text-sm" style={{ color: subtleColor }}>
                                    No reviews yet. Be the first!
                                </p>
                            </div>
                        ) : (
                            reviews.map((review: any) => (
                                <div
                                    key={review.id}
                                    className="p-5 rounded-xl transition-all"
                                    style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                                                style={{
                                                    backgroundColor: bgIsDark ? 'rgba(255,255,255,0.08)' : '#F0F0F0',
                                                    color: ts.text_color,
                                                }}
                                            >
                                                {(review.reviewer_name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm truncate" style={{ color: ts.text_color }}>
                                                    {review.reviewer_name || 'Anonymous'}
                                                </h4>
                                                <div className="flex mt-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            className="w-3 h-3"
                                                            style={{
                                                                fill: star <= review.rating ? starColor : 'transparent',
                                                                color: star <= review.rating ? starColor : cardBorder,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium flex-shrink-0" style={{ color: subtleColor }}>
                                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm leading-relaxed pl-12" style={{ color: mutedColor }}>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Form */}
                    <div
                        className="mt-10 p-6 sm:p-8 rounded-2xl"
                        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                    >
                        <h3 className="font-bold text-base mb-6" style={{ color: ts.text_color }}>
                            Leave a Review
                        </h3>
                        <form onSubmit={handleSubmitReview} className="space-y-5">
                            {/* Stars */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: subtleColor }}>
                                    Rating
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, rating })}
                                            className="transition-all hover:scale-110 p-1"
                                        >
                                            <Star
                                                className="w-7 h-7"
                                                style={{
                                                    fill: reviewForm.rating >= rating ? starColor : 'transparent',
                                                    color: reviewForm.rating >= rating ? starColor : cardBorder,
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: subtleColor }}>
                                        Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={reviewForm.reviewer_name}
                                        onChange={e => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all"
                                        style={{
                                            backgroundColor: inputBg,
                                            border: `1px solid ${cardBorder}`,
                                            color: ts.text_color,
                                        }}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    {/* Empty for layout balance, or add email field later */}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: subtleColor }}>
                                    Review
                                </label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all resize-none"
                                    style={{
                                        backgroundColor: inputBg,
                                        border: `1px solid ${cardBorder}`,
                                        color: ts.text_color,
                                    }}
                                    placeholder="Share your experience..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    backgroundColor: ts.button_color,
                                    color: ts.button_text_color,
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Branding */}
                {ts.show_branding && (
                    <p className="text-center text-[10px] mt-16 pb-4 font-medium" style={{ color: subtleColor }}>
                        Powered by <span className="font-semibold">AffiliGrid</span>
                    </p>
                )}
            </main>

            {/* Newsletter Broadcast Modal */}
            {
                showNewsletterModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity"
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    >
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden text-left">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-indigo-600" />
                                    Broadcast Product
                                </h3>
                                <button
                                    onClick={() => setShowNewsletterModal(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-500 text-sm mb-6">
                                    Instantly send an email campaign to all your subscribers featuring this product. The email will automatically include the product image, price, and description.
                                </p>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject Line</label>
                                    <input
                                        type="text"
                                        value={newsletterSubject}
                                        onChange={(e) => setNewsletterSubject(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800"
                                        disabled={sendingNewsletter}
                                    />
                                </div>

                                <div className="flex bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-8 border border-blue-100 gap-3">
                                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
                                    <p>You must have your SMTP settings configured in your dashboard <b>Settings &gt; Marketing</b> for this to work.</p>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setShowNewsletterModal(false)}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={sendingNewsletter}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBroadcastProduct}
                                        disabled={sendingNewsletter || !newsletterSubject?.trim()}
                                        className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 transition-colors flex items-center gap-2"
                                    >
                                        {sendingNewsletter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        {sendingNewsletter ? 'Sending...' : 'Send Broadcast'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div >
    );
}
