'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Loader2, Globe, Share2, Check, Star, ShoppingBag,
    ExternalLink, ArrowUpRight, Mail, X,
    Twitter, Facebook, Instagram, Linkedin, Github, Link as LinkIcon
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppPixelTracker from '@/components/AppPixelTracker';

// Icon mapping
const iconMap: { [key: string]: any } = {
    Twitter, Facebook, Instagram, Linkedin, Github, Globe, Website: Globe
};

const getIcon = (platform: string, className?: string) => {
    const Icon = iconMap[platform] || LinkIcon;
    return <Icon className={className} />;
};

// Google Fonts loader
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

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const username = params?.username as string;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    // Subscription state
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [dismissedBanner, setDismissedBanner] = useState(false);
    const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

    useEffect(() => {
        if (!username || !profile) return;

        const hasSubscribed = localStorage.getItem(`newsletter_subscribed_${username}`);
        const hasDismissed = sessionStorage.getItem(`newsletter_dismissed_${username}`);

        if (hasSubscribed) {
            setSubscribed(true);
        } else if (!hasDismissed) {
            const timer = setTimeout(() => {
                setShowNewsletterPopup(true);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [username, profile]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscribeEmail) return;

        setSubscribing(true);
        try {
            await api.post(`/subscribe/${profile.username}`, { email: subscribeEmail });
            setSubscribed(true);
            localStorage.setItem(`newsletter_subscribed_${profile.username}`, 'true');
            toast.success('Thanks for subscribing!');
            setSubscribeEmail('');

            // Close popup after a short delay
            setTimeout(() => setShowNewsletterPopup(false), 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to subscribe');
        } finally {
            setSubscribing(false);
        }
    };

    const handleDismissPopup = () => {
        setShowNewsletterPopup(false);
        sessionStorage.setItem(`newsletter_dismissed_${username}`, 'true');
    };

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            try {
                const response = await api.get(`/profile/${username}`);
                setProfile(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    // Load the custom font  
    useEffect(() => {
        if (profile?.theme_settings?.font) {
            loadFont(profile.theme_settings.font);
        }
    }, [profile?.theme_settings?.font]);

    const handleCardClick = (link: any) => {
        if (link.slug) {
            router.push(`/${username}/${link.slug}`);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#111457]" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-400">
                <Navbar forceSolid={true} />
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 mt-20">
                    <Globe className="w-8 h-8 opacity-20 text-[#111457]" />
                </div>
                <h1 className="text-xl font-bold text-[#111457] mb-2">Profile Not Found</h1>
                <p className="text-gray-500">The user @{username} does not exist.</p>
                <Footer />
            </div>
        );
    }

    // Theme settings with defaults
    const ts = {
        background_color: '#FAFAFA',
        text_color: '#111457',
        button_color: '#111457',
        button_text_color: '#FFFFFF',
        font: 'Inter',
        layout: 'grid' as const,
        card_style: 'bordered' as const,
        show_branding: true,
        ...(profile.theme_settings || {}),
    };

    const { links = [] } = profile;
    const profilePicUrl = profile.profile_picture
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${profile.profile_picture}`
        : null;

    // Check if background is dark  
    const isDark = (hex: string) => {
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return (r * 299 + g * 587 + b * 114) / 1000 < 128;
        } catch {
            return false;
        }
    };

    const bgIsDark = isDark(ts.background_color);
    const subtleColor = bgIsDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
    const cardBg = bgIsDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF';
    const cardBorder = bgIsDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6';

    const cardClass = () => {
        let base = 'rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ';
        if (ts.card_style === 'bordered') base += 'border hover:border-opacity-60 ';
        if (ts.card_style === 'shadow') base += 'shadow-md hover:shadow-lg ';
        if (ts.card_style === 'minimal') base += 'hover:opacity-80 ';
        return base;
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor: ts.background_color,
                fontFamily: ts.font + ', sans-serif',
                color: ts.text_color,
            }}
        >
            <AppPixelTracker
                fbPixelId={profile.facebook_pixel_id}
                gaId={profile.google_analytics_id}
            />
            <Navbar forceSolid={!bgIsDark} />

            {/* Announcement Banner */}
            {profile.announcement_active && profile.announcement_text && !dismissedBanner && (
                <div
                    className="relative text-center py-3 px-10 text-sm font-medium"
                    style={{
                        backgroundColor: ts.button_color,
                        color: ts.button_text_color,
                    }}
                >
                    {profile.announcement_text}
                    <button
                        onClick={() => setDismissedBanner(true)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:opacity-70 transition-opacity"
                        style={{ color: ts.button_text_color }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="flex-grow pt-24 pb-12">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center mb-16 relative">
                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="absolute top-0 right-0 md:right-10 p-2 rounded-full transition-all"
                            style={{
                                backgroundColor: bgIsDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                                border: `1px solid ${cardBorder}`,
                                color: subtleColor,
                            }}
                            title="Share Profile"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                        </button>

                        <div className="relative mb-6">
                            <div
                                className="w-32 h-32 rounded-full overflow-hidden shadow-sm"
                                style={{ border: `4px solid ${bgIsDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF'}` }}
                            >
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt={profile.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-4xl font-light"
                                        style={{ backgroundColor: ts.button_color, color: ts.button_text_color }}
                                    >
                                        {profile.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2" style={{ color: ts.text_color }}>
                            @{profile.username}
                        </h1>

                        {profile.bio && (
                            <p className="max-w-lg leading-relaxed mb-6" style={{ color: subtleColor }}>
                                {profile.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        {profile.social_links?.length > 0 && (
                            <div className="flex items-center gap-3">
                                {profile.social_links.map((social: any) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
                                        style={{
                                            backgroundColor: bgIsDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                                            border: `1px solid ${cardBorder}`,
                                            color: subtleColor,
                                        }}
                                    >
                                        {getIcon(social.platform, "w-4 h-4")}
                                    </a>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Content Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-xl font-bold" style={{ color: ts.text_color }}>Products</h2>
                        <div className="h-px flex-1" style={{ backgroundColor: cardBorder }}></div>
                        <span className="text-sm font-semibold" style={{ color: subtleColor }}>{links.length} Items</span>
                    </div>

                    {/* Product Grid / List */}
                    {ts.layout === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {links.map((link: any) => {
                                const imageUrl = link.image_path
                                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${link.image_path}`
                                    : null;

                                const hostname = (() => {
                                    try { return new URL(link.url).hostname.replace('www.', ''); } catch { return ''; }
                                })();

                                return (
                                    <div
                                        key={link.id}
                                        onClick={() => handleCardClick(link)}
                                        className={`group ${cardClass()}`}
                                        style={{
                                            backgroundColor: cardBg,
                                            borderColor: cardBorder,
                                        }}
                                    >
                                        {/* Image */}
                                        <div
                                            className="aspect-[4/3] p-4 flex items-center justify-center relative"
                                            style={{
                                                backgroundColor: bgIsDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
                                                borderBottom: `1px solid ${cardBorder}`,
                                            }}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={link.title}
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <ShoppingBag className="w-12 h-12 opacity-20" style={{ color: ts.text_color }} />
                                            )}

                                            {/* View Details */}
                                            <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                <span
                                                    className="text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5"
                                                    style={{ backgroundColor: ts.button_color, color: ts.button_text_color }}
                                                >
                                                    View Details <ArrowUpRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide truncate max-w-[60%]" style={{ color: subtleColor }}>
                                                    {hostname}
                                                </p>

                                                {link.reviews_avg_rating > 0 && (
                                                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: ts.text_color }}>
                                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                        <span>{Number(link.reviews_avg_rating).toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3
                                                className="font-bold text-base leading-snug line-clamp-2 mb-3"
                                                style={{ color: ts.text_color }}
                                                title={link.title}
                                            >
                                                {link.title}
                                            </h3>

                                            <div className="flex items-center justify-between mt-auto">
                                                {link.price ? (
                                                    <span className="text-lg font-bold" style={{ color: ts.text_color }}>
                                                        ${Number(link.price).toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm font-medium" style={{ color: subtleColor }}>View Price</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* List Layout */
                        <div className="space-y-3">
                            {links.map((link: any) => {
                                const imageUrl = link.image_path
                                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${link.image_path}`
                                    : null;

                                return (
                                    <div
                                        key={link.id}
                                        onClick={() => handleCardClick(link)}
                                        className={`group flex items-center gap-4 p-4 cursor-pointer ${cardClass()}`}
                                        style={{
                                            backgroundColor: cardBg,
                                            borderColor: cardBorder,
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                                            style={{
                                                backgroundColor: bgIsDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
                                            }}
                                        >
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={link.title} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <ShoppingBag className="w-6 h-6 opacity-20" style={{ color: ts.text_color }} />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate" style={{ color: ts.text_color }}>
                                                {link.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                {link.price && (
                                                    <span className="text-sm font-bold" style={{ color: ts.text_color }}>
                                                        ${Number(link.price).toLocaleString()}
                                                    </span>
                                                )}
                                                {link.reviews_avg_rating > 0 && (
                                                    <div className="flex items-center gap-1 text-xs" style={{ color: subtleColor }}>
                                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                        {Number(link.reviews_avg_rating).toFixed(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ArrowUpRight
                                            className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ color: ts.button_color }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {links.length === 0 && (
                        <div
                            className="text-center py-24 rounded-2xl border border-dashed"
                            style={{
                                backgroundColor: cardBg,
                                borderColor: cardBorder,
                            }}
                        >
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: ts.text_color }} />
                            <h3 className="font-medium" style={{ color: ts.text_color }}>No products yet</h3>
                        </div>
                    )}

                    {/* Branding */}
                    {ts.show_branding && (
                        <p className="text-center text-xs mt-12" style={{ color: subtleColor }}>
                            Powered by <span className="font-semibold">AffiliGrid</span>
                        </p>
                    )}

                </div>
            </div>

            <Footer />

            {/* Newsletter Popup Modal */}
            {showNewsletterPopup && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center sm:items-end sm:justify-start p-4 bg-black/40 sm:bg-transparent pointer-events-auto transition-opacity"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <div
                        className="relative w-full sm:w-[350px] sm:m-4 rounded-2xl shadow-2xl p-6"
                        style={{
                            backgroundColor: bgIsDark ? '#1F2937' : '#FFFFFF',
                            border: `1px solid ${cardBorder}`,
                        }}
                    >
                        <button
                            onClick={handleDismissPopup}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            style={{ color: subtleColor }}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                            style={{ backgroundColor: ts.button_color + '15', color: ts.button_color }}>
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-extrabold text-xl mb-1.5" style={{ color: ts.text_color }}>
                            Join my newsletter
                        </h3>
                        <p className="text-sm mb-5 leading-relaxed" style={{ color: subtleColor }}>
                            Get updates on new products and exclusive offers. Don&apos;t miss out!
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={subscribeEmail}
                                onChange={(e) => setSubscribeEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all placeholder:text-gray-400 focus:ring-2"
                                style={{
                                    backgroundColor: bgIsDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                                    borderColor: cardBorder,
                                    color: ts.text_color
                                }}
                            />
                            <button
                                type="submit"
                                disabled={subscribing}
                                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 transition-transform active:scale-95 hover:brightness-110"
                                style={{
                                    backgroundColor: ts.button_color,
                                    color: ts.button_text_color
                                }}
                            >
                                {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
