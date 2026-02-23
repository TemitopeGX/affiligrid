'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SidebarProvider, useSidebar } from '@/components/dashboard/SidebarContext';
import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
                <Loader2 className="w-8 h-8 text-[#111457] animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FC]">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#111457 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <DashboardSidebar />

            <div
                className={cn(
                    "relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
                )}
            >
                <div className="px-6 lg:px-8 pt-2 pl-16 lg:pl-8">
                    <DashboardHeader />
                </div>
                <main className="flex-1 px-6 lg:px-8 pb-8 pt-0">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SidebarProvider>
    );
}
