'use client';

import { useEffect, useState } from 'react';
import { Send, Plus, Trash2, Loader2, Mail, Clock, Users, X, ChevronRight, Settings, KeyRound, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import { toast } from 'sonner';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

interface Campaign {
    id: number;
    subject: string;
    body: string;
    sent_at: string | null;
    recipients_count: number;
    created_at: string;
}

interface SmtpStatus {
    configured: boolean;
    provider: string | null; // 'gmail', 'outlook', 'custom', or null
    fromEmail: string | null;
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [creating, setCreating] = useState(false);
    const [sendingId, setSendingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [smtpStatus, setSmtpStatus] = useState<SmtpStatus>({ configured: false, provider: null, fromEmail: null });

    useEffect(() => {
        fetchCampaigns();
        fetchSmtpStatus();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('/campaigns');
            setCampaigns(res.data);
        } catch {
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const fetchSmtpStatus = async () => {
        try {
            const res = await api.get('/profile');
            const user = res.data.user || res.data;
            const host = user.smtp_host || '';
            const username = user.smtp_username || '';

            let provider: string | null = null;
            if (host.includes('gmail')) provider = 'gmail';
            else if (host.includes('office365') || host.includes('outlook')) provider = 'outlook';
            else if (host) provider = 'custom';

            setSmtpStatus({
                configured: !!(host && username),
                provider,
                fromEmail: user.smtp_from_email || user.smtp_username || null,
            });
        } catch {
            // Silently fail — will show unconfigured state
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await api.post('/campaigns', { subject, body });
            setCampaigns([res.data, ...campaigns]);
            setSubject('');
            setBody('');
            setShowCompose(false);
            toast.success('Campaign created! You can now send it.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create campaign');
        } finally {
            setCreating(false);
        }
    };

    const handleSend = async (id: number) => {
        if (!smtpStatus.configured) {
            toast.error('Configure your email settings first. Go to Settings → Marketing.');
            return;
        }
        if (!confirm('Send this campaign to ALL your subscribers? This cannot be undone.')) return;
        setSendingId(id);
        try {
            const res = await api.post(`/campaigns/${id}/send`);
            toast.success(res.data.message);
            setCampaigns(campaigns.map(c => c.id === id ? res.data.campaign : c));
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send campaign');
        } finally {
            setSendingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this campaign?')) return;
        setDeletingId(id);
        try {
            await api.delete(`/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c.id !== id));
            toast.success('Campaign deleted');
        } catch {
            toast.error('Failed to delete campaign');
        } finally {
            setDeletingId(null);
        }
    };

    // Determine help article based on provider
    const getHelpArticleLink = () => {
        if (smtpStatus.provider === 'gmail') return '/help/setup-gmail-app-password';
        if (smtpStatus.provider === 'outlook') return '/help/setup-outlook-email';
        return '/help/custom-smtp-setup';
    };

    const sentCampaigns = campaigns.filter(c => c.sent_at);
    const draftCampaigns = campaigns.filter(c => !c.sent_at);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <p className="text-sm text-gray-500 mt-1">Compose and send emails to your subscribers</p>
                </div>
                <button
                    onClick={() => setShowCompose(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </button>
            </div>

            {/* SMTP Not Configured Banner */}
            {!smtpStatus.configured && (
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-amber-900 mb-1">Email not configured</h3>
                                <p className="text-[13px] text-amber-700 leading-relaxed mb-4">
                                    You need to set up your email credentials before you can send campaigns.
                                    This allows you to send emails from your own address (e.g., Gmail, Outlook, or a custom domain).
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Link
                                        href="/dashboard/settings?tab=marketing"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
                                    >
                                        <Settings className="w-3.5 h-3.5" />
                                        Go to Email Settings
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Links */}
                    <div className="border-t border-amber-200 bg-amber-50/50 px-5 py-3">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2">Setup Guides</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <Link href="/help/setup-gmail-app-password" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 hover:text-amber-900 transition-colors">
                                <KeyRound className="w-3 h-3" />
                                Gmail App Password Setup
                                <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                            <Link href="/help/setup-outlook-email" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 hover:text-amber-900 transition-colors">
                                <Mail className="w-3 h-3" />
                                Outlook / Microsoft 365 Setup
                                <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                            <Link href="/help/custom-smtp-setup" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 hover:text-amber-900 transition-colors">
                                <Settings className="w-3 h-3" />
                                Custom SMTP Setup
                                <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* SMTP Configured — Status Badge */}
            {smtpStatus.configured && (
                <div className="mb-8 flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-[13px] text-green-700 flex-1">
                        <span className="font-semibold">Email connected</span>
                        {smtpStatus.fromEmail && (
                            <span className="text-green-600"> — sending from <span className="font-mono text-[12px] bg-green-100 px-1.5 py-0.5 rounded">{smtpStatus.fromEmail}</span></span>
                        )}
                    </p>
                    <Link
                        href="/dashboard/settings?tab=marketing"
                        className="text-[11px] font-semibold text-green-600 hover:text-green-800 transition-colors"
                    >
                        Change
                    </Link>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                            <Send className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{sentCampaigns.length}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Drafts</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{draftCampaigns.length}</p>
                </div>
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Compose Campaign</h2>
                            <button
                                onClick={() => setShowCompose(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* SMTP warning inside modal too */}
                        {!smtpStatus.configured && (
                            <div className="mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-start gap-2.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[12px] font-semibold text-amber-800">Email not configured</p>
                                        <p className="text-[11px] text-amber-600 mt-0.5">
                                            You can create drafts, but you&apos;ll need to{' '}
                                            <Link href="/dashboard/settings?tab=marketing" className="underline font-semibold hover:text-amber-800">
                                                configure your email
                                            </Link>{' '}
                                            before sending.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    required
                                    placeholder="e.g. New product just dropped!"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Email Body
                                </label>
                                <RichTextEditor
                                    value={body}
                                    onChange={(html) => setBody(html)}
                                    placeholder="Write your email content here..."
                                    minHeight="300px"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    {creating ? 'Creating...' : 'Create Campaign'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCompose(false)}
                                    className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Drafts */}
            {draftCampaigns.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Drafts — Ready to Send
                    </h2>
                    <div className="space-y-3">
                        {draftCampaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 truncate">{campaign.subject}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {campaign.body.replace(/<[^>]+>/g, '').slice(0, 120)}...
                                        </p>
                                        <p className="text-[10px] text-gray-300 mt-2">
                                            Created {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {smtpStatus.configured ? (
                                            <button
                                                onClick={() => handleSend(campaign.id)}
                                                disabled={sendingId === campaign.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
                                            >
                                                {sendingId === campaign.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Send className="w-3.5 h-3.5" />
                                                )}
                                                {sendingId === campaign.id ? 'Sending...' : 'Send'}
                                            </button>
                                        ) : (
                                            <Link
                                                href="/dashboard/settings?tab=marketing"
                                                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-200 transition-all"
                                            >
                                                <Settings className="w-3.5 h-3.5" />
                                                Setup Email
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => handleDelete(campaign.id)}
                                            disabled={deletingId === campaign.id}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            {deletingId === campaign.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sent Campaigns */}
            {sentCampaigns.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        Sent Campaigns
                    </h2>
                    <div className="space-y-3">
                        {sentCampaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 truncate">{campaign.subject}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {campaign.body.replace(/<[^>]+>/g, '').slice(0, 120)}...
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                                                <Send className="w-3 h-3" />
                                                Sent {new Date(campaign.sent_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                                                <Users className="w-3 h-3" />
                                                {campaign.recipients_count} recipient{campaign.recipients_count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        disabled={deletingId === campaign.id}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                                    >
                                        {deletingId === campaign.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {campaigns.length === 0 && (
                <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <Send className="w-6 h-6 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">No campaigns yet</h3>
                    <p className="text-sm text-gray-400 mb-6">Create your first email campaign to reach your subscribers.</p>
                    <button
                        onClick={() => setShowCompose(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Campaign
                    </button>
                </div>
            )}
        </div>
    );
}
