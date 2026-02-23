'use client';

import { useState, useEffect } from 'react';
import {
    Check, Loader2, ExternalLink, Eye, Save,
    Palette, Layout, Type, ShoppingBag, Star, ArrowUpRight
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const FONTS = [
    { label: 'Inter', value: 'Inter' },
    { label: 'DM Sans', value: 'DM Sans' },
    { label: 'Outfit', value: 'Outfit' },
    { label: 'Space Grotesk', value: 'Space Grotesk' },
    { label: 'Poppins', value: 'Poppins' },
];

const PRESETS = [
    { name: 'Clean White', bg: '#FFFFFF', text: '#111457', button: '#111457', buttonText: '#FFFFFF' },
    { name: 'Soft Gray', bg: '#F5F5F5', text: '#1A1A2E', button: '#1A1A2E', buttonText: '#FFFFFF' },
    { name: 'Warm Cream', bg: '#FFF8F0', text: '#2D2A26', button: '#E07A3A', buttonText: '#FFFFFF' },
    { name: 'Dark Mode', bg: '#0F0F14', text: '#FFFFFF', button: '#6366F1', buttonText: '#FFFFFF' },
    { name: 'Ocean Blue', bg: '#EEF2FF', text: '#1E3A5F', button: '#2563EB', buttonText: '#FFFFFF' },
    { name: 'Forest', bg: '#F0FDF4', text: '#14532D', button: '#16A34A', buttonText: '#FFFFFF' },
];

const CARD_STYLES = [
    { label: 'Bordered', value: 'bordered', desc: 'Clean border outline' },
    { label: 'Shadow', value: 'shadow', desc: 'Elevated with shadow' },
    { label: 'Minimal', value: 'minimal', desc: 'No border or shadow' },
];

interface ThemeSettings {
    background_color: string;
    text_color: string;
    button_color: string;
    button_text_color: string;
    font: string;
    layout: 'grid' | 'list';
    card_style: 'bordered' | 'shadow' | 'minimal';
    show_branding: boolean;
}

const DEFAULT_THEME: ThemeSettings = {
    background_color: '#FFFFFF',
    text_color: '#111457',
    button_color: '#111457',
    button_text_color: '#FFFFFF',
    font: 'Inter',
    layout: 'grid',
    card_style: 'bordered',
    show_branding: true,
};

export default function AppearancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
    const [hasChanges, setHasChanges] = useState(false);
    const [savedTheme, setSavedTheme] = useState<ThemeSettings>(DEFAULT_THEME);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/user');
                setUsername(response.data.username);
                const settings = response.data.theme_settings;
                if (settings) {
                    const merged = { ...DEFAULT_THEME, ...settings };
                    setTheme(merged);
                    setSavedTheme(merged);
                }
            } catch (error) {
                console.error('Failed to load settings', error);
                toast.error('Failed to load appearance settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const updateTheme = (updates: Partial<ThemeSettings>) => {
        setTheme(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
    };

    const applyPreset = (preset: typeof PRESETS[0]) => {
        updateTheme({
            background_color: preset.bg,
            text_color: preset.text,
            button_color: preset.button,
            button_text_color: preset.buttonText,
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/profile/theme', { theme_settings: theme });
            setSavedTheme(theme);
            setHasChanges(false);
            toast.success('Appearance saved!');
        } catch (error) {
            console.error('Failed to save settings', error);
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setTheme(savedTheme);
        setHasChanges(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    // Helper to check if a color is dark
    const isDark = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    return (
        <div className="pb-8 xl:pb-0 xl:h-[calc(100vh-120px)] xl:flex xl:flex-col">
            <style>{`
                .appearance-scroll::-webkit-scrollbar { width: 4px; }
                .appearance-scroll::-webkit-scrollbar-track { background: transparent; }
                .appearance-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
                .appearance-scroll::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[#111457]">Appearance</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Customize your storefront look & feel</p>
                </div>
                <div className="flex items-center gap-2">
                    {username && (
                        <a
                            href={`/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-medium text-gray-500 hover:text-[#111457] hover:border-gray-200 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Store
                        </a>
                    )}
                    {hasChanges && (
                        <>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="xl:flex xl:gap-8 xl:flex-1 xl:min-h-0">
                {/* Settings Panel */}
                <div className="space-y-5 order-2 xl:order-1 xl:flex-1 xl:overflow-y-auto xl:min-h-0 xl:pr-2 pb-8 appearance-scroll">

                    {/* Color Presets */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-[#111457]">Color Presets</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Quick-start with a preset theme</p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {PRESETS.map((preset) => {
                                const isActive =
                                    theme.background_color === preset.bg &&
                                    theme.text_color === preset.text &&
                                    theme.button_color === preset.button;
                                return (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className={`group relative p-2 rounded-xl border-2 transition-all text-center ${isActive ? 'border-[#111457]' : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div
                                            className="w-full aspect-square rounded-lg mb-1.5 flex items-center justify-center text-xs font-bold"
                                            style={{ backgroundColor: preset.bg, color: preset.text, border: `1px solid ${preset.bg === '#FFFFFF' ? '#E5E7EB' : 'transparent'}` }}
                                        >
                                            Aa
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500">{preset.name}</span>
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111457] flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="text-sm font-bold text-[#111457] mb-4">Custom Colors</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Background', key: 'background_color' as const },
                                { label: 'Text', key: 'text_color' as const },
                                { label: 'Button', key: 'button_color' as const },
                                { label: 'Button Text', key: 'button_text_color' as const },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="text-xs text-gray-400 font-medium mb-1.5 block">{label}</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={theme[key]}
                                                onChange={(e) => updateTheme({ [key]: e.target.value })}
                                                className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer appearance-none p-0 overflow-hidden"
                                                style={{ backgroundColor: theme[key] }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={theme[key]}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                    updateTheme({ [key]: val });
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-100 text-xs font-mono text-[#111457] focus:outline-none focus:border-gray-200 transition-colors uppercase"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Font */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Type className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-[#111457]">Font</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Choose a typeface for your storefront</p>
                        <div className="flex flex-wrap gap-2">
                            {FONTS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => updateTheme({ font: f.value })}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${theme.font === f.value
                                        ? 'bg-[#111457] text-white'
                                        : 'border border-gray-100 text-gray-500 hover:border-gray-200 hover:text-[#111457]'
                                        }`}
                                    style={{ fontFamily: f.value }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Layout & Card Style */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Layout className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-[#111457]">Layout & Cards</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">How products are displayed</p>

                        {/* Layout Toggle */}
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-xs font-medium text-gray-400 w-16">Layout</span>
                            <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                <button
                                    onClick={() => updateTheme({ layout: 'grid' })}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${theme.layout === 'grid' ? 'bg-[#111457] text-white' : 'text-gray-400'
                                        }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => updateTheme({ layout: 'list' })}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${theme.layout === 'list' ? 'bg-[#111457] text-white' : 'text-gray-400'
                                        }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>

                        {/* Card Style */}
                        <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-gray-400 w-16 pt-2">Cards</span>
                            <div className="flex flex-wrap gap-2 flex-1">
                                {CARD_STYLES.map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => updateTheme({ card_style: style.value as any })}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${theme.card_style === style.value
                                            ? 'bg-[#111457] text-white'
                                            : 'border border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-[#111457]">Show AffiliGrid Branding</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Display &quot;Powered by AffiliGrid&quot; on your store</p>
                            </div>
                            <button
                                onClick={() => updateTheme({ show_branding: !theme.show_branding })}
                                className={`relative w-11 h-6 rounded-full transition-colors ${theme.show_branding ? 'bg-[#111457]' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme.show_branding ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="order-1 xl:order-2 xl:w-[400px] xl:flex-shrink-0 mb-5 xl:mb-0">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-[#111457] uppercase tracking-wider">Live Preview</span>
                        </div>
                        <div
                            className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
                            style={{ fontFamily: theme.font + ', sans-serif' }}
                        >
                            {/* Fake browser chrome */}
                            <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 font-mono truncate">
                                    affiligrid.com/{username}
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div
                                className="p-5 min-h-[420px]"
                                style={{ backgroundColor: theme.background_color }}
                            >
                                {/* Profile */}
                                <div className="flex flex-col items-center text-center mb-5">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2"
                                        style={{ backgroundColor: theme.button_color, color: theme.button_text_color }}
                                    >
                                        {username?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <h3
                                        className="text-sm font-bold"
                                        style={{ color: theme.text_color }}
                                    >
                                        @{username || 'username'}
                                    </h3>
                                    <p className="text-[10px] mt-0.5 opacity-50" style={{ color: theme.text_color }}>
                                        Affiliate marketer & product curator
                                    </p>
                                </div>

                                {/* Products */}
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-40" style={{ color: theme.text_color }}>
                                    Products
                                </p>

                                {theme.layout === 'grid' ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`rounded-lg overflow-hidden ${theme.card_style === 'bordered' ? 'border' : ''
                                                    } ${theme.card_style === 'shadow' ? 'shadow-md' : ''}`}
                                                style={{
                                                    backgroundColor: isDark(theme.background_color)
                                                        ? 'rgba(255,255,255,0.05)'
                                                        : '#FFFFFF',
                                                    borderColor: isDark(theme.background_color)
                                                        ? 'rgba(255,255,255,0.1)'
                                                        : '#F3F4F6',
                                                }}
                                            >
                                                <div
                                                    className="aspect-[4/3] flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: isDark(theme.background_color)
                                                            ? 'rgba(255,255,255,0.03)'
                                                            : '#F9FAFB',
                                                    }}
                                                >
                                                    <ShoppingBag className="w-5 h-5 opacity-20" style={{ color: theme.text_color }} />
                                                </div>
                                                <div className="p-2">
                                                    <div
                                                        className="h-1.5 rounded-full w-3/4 mb-1 opacity-20"
                                                        style={{ backgroundColor: theme.text_color }}
                                                    />
                                                    <div
                                                        className="h-1.5 rounded-full w-1/2 opacity-10"
                                                        style={{ backgroundColor: theme.text_color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-2 rounded-lg ${theme.card_style === 'bordered' ? 'border' : ''
                                                    } ${theme.card_style === 'shadow' ? 'shadow-md' : ''}`}
                                                style={{
                                                    backgroundColor: isDark(theme.background_color)
                                                        ? 'rgba(255,255,255,0.05)'
                                                        : '#FFFFFF',
                                                    borderColor: isDark(theme.background_color)
                                                        ? 'rgba(255,255,255,0.1)'
                                                        : '#F3F4F6',
                                                }}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        backgroundColor: isDark(theme.background_color)
                                                            ? 'rgba(255,255,255,0.03)'
                                                            : '#F9FAFB',
                                                    }}
                                                >
                                                    <ShoppingBag className="w-4 h-4 opacity-20" style={{ color: theme.text_color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        className="h-1.5 rounded-full w-3/4 mb-1 opacity-20"
                                                        style={{ backgroundColor: theme.text_color }}
                                                    />
                                                    <div
                                                        className="h-1.5 rounded-full w-1/2 opacity-10"
                                                        style={{ backgroundColor: theme.text_color }}
                                                    />
                                                </div>
                                                <ArrowUpRight className="w-3 h-3 opacity-20 flex-shrink-0" style={{ color: theme.text_color }} />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Branding */}
                                {theme.show_branding && (
                                    <p className="text-center text-[9px] mt-5 opacity-30" style={{ color: theme.text_color }}>
                                        Powered by AffiliGrid
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
