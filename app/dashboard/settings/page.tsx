'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, CreditCard, Save, Lock, Mail, Camera, Loader2, Eye, EyeOff, AtSign, FileText, Megaphone, Send, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<any>({
        username: '',
        email: '',
        bio: '',
        profile_picture: null,
        facebook_pixel_id: '',
        google_analytics_id: '',
        announcement_text: '',
        announcement_active: false,
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        smtp_from_email: '',
        smtp_from_name: '',
    });
    const [smtpPreset, setSmtpPreset] = useState('gmail');
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [passwords, setPasswords] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            // smtp_password is hidden in API response, so keep it empty in state.
            // We use smtp_has_password flag to know if one is saved.
            const data = { ...response.data, smtp_password: '' };
            setUserData(data);

            // Auto-detect preset from saved host
            const host = data.smtp_host || '';
            if (host.includes('gmail')) {
                setSmtpPreset('gmail');
            } else if (host.includes('office365') || host.includes('outlook')) {
                setSmtpPreset('outlook');
            } else if (host) {
                setSmtpPreset('custom');
            }
        } catch (error) {
            console.error('Failed to load profile', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        setSaving(true);

        // Inject preset host/port/encryption before saving
        let smtpHost = userData.smtp_host;
        let smtpPort = userData.smtp_port;
        let smtpEnc = userData.smtp_encryption;
        if (smtpPreset === 'gmail') {
            smtpHost = 'smtp.gmail.com';
            smtpPort = 587;
            smtpEnc = 'tls';
        } else if (smtpPreset === 'outlook') {
            smtpHost = 'smtp.office365.com';
            smtpPort = 587;
            smtpEnc = 'tls';
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        if (userData.bio) formData.append('bio', userData.bio);
        if (userData.facebook_pixel_id) formData.append('facebook_pixel_id', userData.facebook_pixel_id);
        if (userData.google_analytics_id) formData.append('google_analytics_id', userData.google_analytics_id);
        if (userData.announcement_text) formData.append('announcement_text', userData.announcement_text);
        formData.append('announcement_active', userData.announcement_active ? '1' : '0');
        if (smtpHost) formData.append('smtp_host', smtpHost);
        if (smtpPort) formData.append('smtp_port', String(smtpPort));
        if (userData.smtp_username) formData.append('smtp_username', userData.smtp_username);
        if (userData.smtp_password) formData.append('smtp_password', userData.smtp_password);
        if (smtpEnc) formData.append('smtp_encryption', smtpEnc);
        if (userData.smtp_from_email) formData.append('smtp_from_email', userData.smtp_from_email);
        if (userData.smtp_from_name) formData.append('smtp_from_name', userData.smtp_from_name);

        if (fileInputRef.current?.files?.[0]) {
            formData.append('profile_picture', fileInputRef.current.files[0]);
        }

        try {
            const response = await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Preserve the password field in state — API won't return it
            const savedPassword = userData.smtp_password;
            setUserData({ ...response.data, smtp_password: savedPassword || '' });
            toast.success('Profile updated');
            setValidationErrors({});
        } catch (error: any) {
            console.error('Update failed', error);
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
                toast.error('Please check the form for errors');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwords.password !== passwords.password_confirmation) {
            toast.error('New passwords do not match');
            return;
        }

        setSaving(true);
        try {
            await api.put('/profile/password', passwords);
            toast.success('Password updated');
            setPasswords({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            console.error('Password update failed', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setUserData((prev: any) => ({ ...prev, profile_picture_preview: ev.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        );
    }

    const tabs = [
        { id: 'general', name: 'General', icon: User },
        { id: 'marketing', name: 'Marketing', icon: Megaphone },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'billing', name: 'Billing', icon: CreditCard },
    ];

    const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-[#111457] placeholder:text-gray-300 outline-none focus:bg-white focus:border-gray-200 transition-all";
    const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";
    const errorInputClass = "w-full px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-[#111457] placeholder:text-gray-300 outline-none focus:bg-white focus:border-red-200 transition-all";

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[#111457]">Settings</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage your account and preferences</p>
                </div>
                {(activeTab === 'general' || activeTab === 'marketing') && (
                    <button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 bg-gray-50 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white text-[#111457] shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div>
                {/* General */}
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        {/* Avatar Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-4">Profile Photo</h2>
                            <div className="flex items-center gap-5">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                                        {(userData.profile_picture_preview || userData.profile_picture) ? (
                                            <img
                                                src={userData.profile_picture_preview || `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${userData.profile_picture}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-7 h-7 text-gray-300" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#111457] text-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#0d1045] transition-colors"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#111457]">
                                        {userData.username || 'Your Name'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-medium text-gray-400 hover:text-[#111457] mt-1.5 transition-colors"
                                    >
                                        Change photo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Username</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="text"
                                            value={userData.username}
                                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                            className={`${validationErrors.username ? errorInputClass : inputClass} pl-10`}
                                        />
                                    </div>
                                    {validationErrors.username && (
                                        <p className="text-red-400 text-xs mt-1.5">{validationErrors.username[0]}</p>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className={`${validationErrors.email ? errorInputClass : inputClass} pl-10`}
                                        />
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-red-400 text-xs mt-1.5">{validationErrors.email[0]}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Bio</label>
                                    <textarea
                                        rows={3}
                                        value={userData.bio || ''}
                                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Tell visitors about yourself..."
                                    />
                                    {validationErrors.bio && (
                                        <p className="text-red-400 text-xs mt-1.5">{validationErrors.bio[0]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Marketing */}
                {activeTab === 'marketing' && (
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-1">Tracking Pixels</h2>
                            <p className="text-xs text-gray-400 mb-5">Add your tracking IDs to retarget visitors on other platforms.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Facebook Pixel ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 1234567890"
                                        value={userData.facebook_pixel_id || ''}
                                        onChange={(e) => setUserData({ ...userData, facebook_pixel_id: e.target.value })}
                                        className={inputClass}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        Found in Events Manager {'>'} Data Sources {'>'} Settings.
                                    </p>
                                </div>
                                <div>
                                    <label className={labelClass}>Google Analytics ID / Tag</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. G-XXXXXXXXXX"
                                        value={userData.google_analytics_id || ''}
                                        onChange={(e) => setUserData({ ...userData, google_analytics_id: e.target.value })}
                                        className={inputClass}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        Usually starts with "G-" or "UA-".
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Announcement Banner */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-1">Announcement Banner</h2>
                            <p className="text-xs text-gray-400 mb-5">Show an announcement at the top of your public store page.</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-gray-500">Enable Banner</label>
                                    <button
                                        type="button"
                                        onClick={() => setUserData({ ...userData, announcement_active: !userData.announcement_active })}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${userData.announcement_active ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${userData.announcement_active ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div>
                                    <label className={labelClass}>Banner Message</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 🔥 New product just dropped! Use code WELCOME for 10% off"
                                        value={userData.announcement_text || ''}
                                        onChange={(e) => setUserData({ ...userData, announcement_text: e.target.value })}
                                        className={inputClass}
                                        maxLength={500}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        Displayed at the top of your public profile and store pages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Configuration */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-1">Email Configuration</h2>
                            <p className="text-xs text-gray-400 mb-5">Set up your own email to send campaigns from your address, not AffiliGrid's.</p>

                            {/* Provider Tabs */}
                            <div className="flex gap-1 p-1 bg-gray-50 rounded-xl mb-5">
                                {[
                                    { id: 'gmail', label: 'Gmail / Google' },
                                    { id: 'outlook', label: 'Outlook / 365' },
                                    { id: 'custom', label: 'Custom SMTP' },
                                ].map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => {
                                            setSmtpPreset(preset.id);
                                            if (preset.id === 'gmail') {
                                                setUserData((p: any) => ({ ...p, smtp_host: 'smtp.gmail.com', smtp_port: 587, smtp_encryption: 'tls' }));
                                            } else if (preset.id === 'outlook') {
                                                setUserData((p: any) => ({ ...p, smtp_host: 'smtp.office365.com', smtp_port: 587, smtp_encryption: 'tls' }));
                                            }
                                        }}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${smtpPreset === preset.id
                                            ? 'bg-white text-[#111457] shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            {/* Gmail Hint */}
                            {smtpPreset === 'gmail' && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        <strong>Gmail setup:</strong> Use an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline font-bold">App Password</a> (not your regular password). Go to Google Account → Security → 2-Step Verification → App Passwords.
                                    </p>
                                </div>
                            )}

                            {smtpPreset === 'outlook' && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        <strong>Outlook setup:</strong> Use your Outlook/Microsoft 365 email and password. Enable SMTP in your account settings if not already done.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {smtpPreset === 'custom' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>SMTP Host</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. smtp.yourdomain.com"
                                                value={userData.smtp_host || ''}
                                                onChange={(e) => setUserData({ ...userData, smtp_host: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Port</label>
                                            <input
                                                type="number"
                                                placeholder="587"
                                                value={userData.smtp_port || ''}
                                                onChange={(e) => setUserData({ ...userData, smtp_port: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className={labelClass}>Email / Username</label>
                                    <input
                                        type="email"
                                        placeholder={smtpPreset === 'gmail' ? 'you@gmail.com' : smtpPreset === 'outlook' ? 'you@outlook.com' : 'you@yourdomain.com'}
                                        value={userData.smtp_username || ''}
                                        onChange={(e) => setUserData({ ...userData, smtp_username: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Password / App Password</label>
                                    <input
                                        type="password"
                                        placeholder={userData.smtp_has_password && !userData.smtp_password ? '••••••• (saved)' : '••••••••••••••••'}
                                        value={userData.smtp_password || ''}
                                        onChange={(e) => setUserData({ ...userData, smtp_password: e.target.value })}
                                        className={inputClass}
                                    />
                                    {userData.smtp_has_password && !userData.smtp_password && (
                                        <p className="text-[10px] text-green-600 mt-1.5 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Password saved. Leave blank to keep current, or enter a new one to update.
                                        </p>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {smtpPreset === 'gmail' ? 'Use a 16-character App Password from Google.' : 'Your email account password.'}
                                    </p>
                                </div>

                                {smtpPreset === 'custom' && (
                                    <div>
                                        <label className={labelClass}>Encryption</label>
                                        <select
                                            value={userData.smtp_encryption || 'tls'}
                                            onChange={(e) => setUserData({ ...userData, smtp_encryption: e.target.value })}
                                            className={inputClass}
                                        >
                                            <option value="tls">TLS (Recommended)</option>
                                            <option value="ssl">SSL</option>
                                        </select>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Sender Identity</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>From Name</label>
                                            <input
                                                type="text"
                                                placeholder="Your Brand Name"
                                                value={userData.smtp_from_name || ''}
                                                onChange={(e) => setUserData({ ...userData, smtp_from_name: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>From Email</label>
                                            <input
                                                type="email"
                                                placeholder="hello@yourdomain.com"
                                                value={userData.smtp_from_email || ''}
                                                onChange={(e) => setUserData({ ...userData, smtp_from_email: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Test Connection */}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setTestingSmtp(true);
                                        try {
                                            // Save first
                                            await handleProfileUpdate();
                                            const res = await api.post('/campaigns/test-smtp');
                                            toast.success(res.data.message);
                                        } catch (err: any) {
                                            toast.error(err.response?.data?.message || 'SMTP test failed');
                                        } finally {
                                            setTestingSmtp(false);
                                        }
                                    }}
                                    disabled={testingSmtp || !userData.smtp_username}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                                >
                                    {testingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {testingSmtp ? 'Sending test email...' : 'Send Test Email'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                    <div className="space-y-5">
                        {/* Change Password */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h2 className="text-sm font-bold text-[#111457] mb-1">Change Password</h2>
                            <p className="text-xs text-gray-400 mb-5">Update your password to keep your account secure.</p>

                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className={labelClass}>Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={passwords.current_password}
                                            onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                                            className={`${inputClass} pl-10 pr-10`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={passwords.password}
                                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                                            className={`${inputClass} pl-10 pr-10`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={passwords.password_confirmation}
                                            onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
                                            className={`${inputClass} pl-10 pr-10`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePasswordUpdate}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-[#111457] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0d1045] transition-colors disabled:opacity-50 mt-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </div>

                        {/* 2FA */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-[#111457]">Two-Factor Authentication</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account.</p>
                                </div>
                                <div className="relative w-11 h-6 rounded-full bg-gray-100 cursor-not-allowed">
                                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                            <div className="mt-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                                <p className="text-xs text-gray-400">Coming soon — we're working on adding 2FA support.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholder tabs */}
                {(activeTab === 'notifications' || activeTab === 'billing') && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center h-[360px]">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            {activeTab === 'notifications'
                                ? <Bell className="w-6 h-6 text-gray-300" />
                                : <CreditCard className="w-6 h-6 text-gray-300" />
                            }
                        </div>
                        <h3 className="text-sm font-bold text-[#111457] capitalize">{activeTab}</h3>
                        <p className="text-xs text-gray-400 max-w-xs mt-1.5 leading-relaxed">
                            This section is under development. Check back soon for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
