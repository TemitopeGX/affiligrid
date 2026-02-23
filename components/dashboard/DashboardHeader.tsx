'use client';

import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardHeader() {
    const { user } = useAuth();

    const profilePicUrl = user?.profile_picture
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.profile_picture}`
        : null;

    return (
        <header className="flex items-center justify-between py-6 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-[#111457]">
                    AffiliGrid
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage and share your affiliate links in one place.</p>
            </div>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#111457]/20 w-64 transition-all"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-400 hover:text-[#111457] transition-colors rounded-full hover:bg-gray-50">
                        <Bell className="w-5 h-5" />
                        {/* Removed static notification dot until real notifications are implemented */}
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-[#111457] capitalize">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-gray-500">Affiliate Marketer</p>
                        </div>
                        <div className="relative w-10 h-10 rounded-full bg-[#111457] text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white overflow-hidden">
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt={user?.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="uppercase">{user?.username?.substring(0, 2) || 'GU'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
