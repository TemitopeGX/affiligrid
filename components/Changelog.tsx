'use client';

const updates = [
    {
        date: 'FEB 15, 2026',
        title: 'Deep audience insights and analytics',
        description: 'Track exactly where your traffic comes from. Granular views for Instagram, TikTok, and Twitter referrals...',
        isActive: true,
    },
    {
        date: 'FEB 4, 2026',
        title: 'Complete storefront theme control',
        description: "Choose your own color palettes, typography, and custom layouts to perfectly match your brand's unique identity...",
        isActive: false,
    },
    {
        date: 'JAN 28, 2026',
        title: 'Automated email capture & broadcasts',
        description: 'Stop losing your audience. Capture visitor emails natively and broadcast new affiliate links with single-click HTML...',
        isActive: false,
    },
    {
        date: 'JAN 21, 2026',
        title: 'Unlimited products & category groups',
        description: 'Organize your growing affiliate portfolio into clean, scrollable categories so buyers find what they need instantly.',
        isActive: false,
    },
];

export default function Changelog() {
    return (
        <section id="changelog" className="py-24 md:py-32 bg-[#0A0A0A] relative border-y border-white/5 font-sans">
            <div className="w-full mx-auto px-6 md:px-12 lg:px-16 max-w-[85rem]">

                {/* Header */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
                        Changelog
                    </h2>
                </div>

                <div className="relative w-full">
                    {/* The horizontal connector line */}
                    <div className="absolute top-[9px] left-0 right-0 h-[1px] bg-white/[0.08]" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative z-10">
                        {updates.map((update, idx) => (
                            <div key={idx} className="flex flex-col relative group cursor-pointer">

                                {/* Point on line */}
                                <div className="mb-10 relative flex items-center h-5">
                                    <div className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center transition-colors group-hover:border-white/30">
                                        {update.isActive ? (
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500] shadow-[0_0_8px_rgba(255,69,0,0.8)]" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col pr-4">
                                    <h3 className="text-[15px] font-semibold text-white mb-2 leading-snug">
                                        {update.title}
                                    </h3>

                                    <p className="text-[14px] text-white/50 leading-relaxed mb-6 line-clamp-2">
                                        {update.description}
                                    </p>

                                    <div className="text-[11px] font-mono font-medium text-white/30 tracking-widest uppercase mt-auto">
                                        {update.date}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
