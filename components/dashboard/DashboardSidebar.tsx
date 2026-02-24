'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    Link2,
    Layers,
    BarChart3,
    Settings,
    Palette,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ExternalLink,
    Users,
    Send,
    HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/dashboard/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/links', icon: Link2 },
    { name: 'Categories', href: '/dashboard/categories', icon: Layers },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Audience', href: '/dashboard/audience', icon: Users },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Send },
    { name: 'Appearance', href: '/dashboard/appearance', icon: Palette },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const profilePicUrl = user?.profile_picture
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.profile_picture}`
        : null;

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className={cn(
                "flex items-center shrink-0 h-16",
                isCollapsed ? "justify-center" : "justify-between px-5"
            )}>
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center">
                        <Image
                            src="/logo-blue.svg"
                            alt="AffiliGrid"
                            width={120}
                            height={28}
                            className="object-contain"
                        />
                    </Link>
                )}
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-[#111457] hover:bg-gray-100 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-[#111457] hover:bg-gray-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {!isCollapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 px-3 mb-3">Menu</p>
                )}
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'group relative flex items-center gap-x-3 rounded-xl text-[13px] font-medium transition-all duration-200',
                                        isCollapsed ? 'justify-center py-3 px-0' : 'py-2.5 px-3',
                                        active
                                            ? 'bg-[#111457] text-white'
                                            : 'text-gray-500 hover:text-[#111457] hover:bg-gray-50'
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <item.icon
                                        className={cn(
                                            'shrink-0',
                                            isCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]',
                                            active ? 'text-white' : 'text-gray-400 group-hover:text-[#111457]'
                                        )}
                                    />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Public profile link */}
                {!isCollapsed && user?.username && (
                    <div className="mt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 px-3 mb-3">Your Store</p>
                        <Link
                            href={`/${user.username}`}
                            target="_blank"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-[#111457] hover:bg-gray-50 transition-all"
                        >
                            <ExternalLink className="w-[18px] h-[18px] text-gray-400" />
                            <span className="truncate">/{user.username}</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Bottom: User + Logout */}
            <div className="shrink-0 border-t border-gray-100 p-3">
                {/* User Card */}
                {!isCollapsed && (
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#111457] text-white flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0">
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="uppercase">{user?.username?.substring(0, 2) || 'U'}</span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#111457] truncate capitalize">{user?.username || 'User'}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={logout}
                    className={cn(
                        'w-full group flex items-center gap-x-3 rounded-xl text-[13px] font-medium text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-all',
                        isCollapsed ? 'justify-center py-2.5 px-0' : 'py-2.5 px-3'
                    )}
                    title={isCollapsed ? "Log out" : undefined}
                >
                    <LogOut className={cn(
                        "shrink-0 group-hover:text-red-500 transition-colors",
                        isCollapsed ? "h-5 w-5" : "h-[18px] w-[18px]"
                    )} />
                    {!isCollapsed && <span>Log out</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-5 left-4 z-50 p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <NavContent />
            </div>

            {/* Desktop Sidebar */}
            <div className={cn(
                "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
                isCollapsed ? "lg:w-[72px]" : "lg:w-64"
            )}>
                <NavContent />
            </div>
        </>
    );
}
