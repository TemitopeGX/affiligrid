'use client';

export default function WhyChooseUs() {
    return (
        <section className="py-24 md:py-32 bg-[#111457] border-y border-white/10 relative overflow-hidden">
            {/* Background noise/texture for that premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')` }}></div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dashRun {
                    to { stroke-dashoffset: -20; }
                }
                .animate-dash {
                    animation: dashRun 1s linear infinite;
                }
            `}} />

            <div className="w-full mx-auto px-6 md:px-12 lg:px-16 relative z-10">

                {/* Header - Large Typography */}
                <div className="max-w-[75rem] mx-auto mb-20 md:mb-32">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15]">
                        <span className="text-white">A new era for affiliates. </span>
                        <span className="text-white/40">Purpose-built for modern marketers with conversion at its core, AffiliGrid sets a new standard for managing and scaling affiliate revenue.</span>
                    </h2>
                </div>

                {/* 3 Column Grid */}
                <div className="max-w-[75rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-y-0 relative">

                    {/* Vertical Dividers (Desktop Only) */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-white/10" />
                    <div className="hidden md:block absolute top-0 bottom-0 left-[66.666%] w-px bg-white/10" />

                    {/* Column 1 */}
                    <div className="flex flex-col md:pr-10 lg:pr-16">
                        {/* Abstract Wireframe Visual - Unified Grid */}
                        <div className="w-full aspect-square max-w-[280px] mx-auto mb-16 relative flex items-center justify-center opacity-80">
                            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {/* Central Pillar/Base */}
                                <path d="M100 80L150 105L100 130L50 105L100 80Z" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
                                <path d="M50 105V115L100 140V130L50 105Z" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                                <path d="M150 105V115L100 140V130L150 105Z" stroke="white" strokeOpacity="0.4" strokeWidth="1" />

                                {/* Floating Grid Item 1 (Top Left) */}
                                <path d="M75 50L100 62.5L75 75L50 62.5L75 50Z" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
                                {/* Floating Grid Item 2 (Top Right) */}
                                <path d="M125 50L150 62.5L125 75L100 62.5L125 50Z" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
                                {/* Floating Accent Highlight */}
                                <path d="M100 145L125 157.5L100 170L75 157.5L100 145Z" stroke="#FF6600" strokeOpacity="0.8" strokeWidth="1" />

                                {/* Connecting dashed lines */}
                                <path d="M75 80 V70" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />
                                <path d="M125 80 V70" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-bold tracking-tight mb-3">One centralized hub</h3>
                            <p className="text-white/50 text-[15px] leading-relaxed font-medium">
                                Bring your scattered affiliate links, products, and social campaigns into one beautifully structured visual storefront.
                            </p>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col md:px-10 lg:px-16">
                        {/* Abstract Wireframe Visual - Isometric Bar Chart */}
                        <div className="w-full aspect-square max-w-[280px] mx-auto mb-16 relative flex items-center justify-center opacity-80">
                            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {/* Bar 1 (Lowest) */}
                                <path d="M50 130L70 140L70 150L50 140V130Z" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
                                <path d="M70 140L90 130L90 140L70 150V140Z" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                                <path d="M50 130L70 120L90 130L70 140L50 130Z" stroke="white" strokeOpacity="0.5" strokeWidth="1" />

                                {/* Bar 2 (Mid) */}
                                <path d="M80 105L100 115L100 145L80 135V105Z" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                                <path d="M100 115L120 105L120 135L100 145V115Z" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
                                <path d="M80 105L100 95L120 105L100 115L80 105Z" stroke="white" strokeOpacity="0.8" strokeWidth="1" />

                                {/* Bar 3 (Tall + Highlighted) */}
                                <path d="M110 60L130 70L130 130L110 120V60Z" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
                                <path d="M130 70L150 60L150 120L130 130V70Z" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                                <path d="M110 60L130 50L150 60L130 70L110 60Z" stroke="#FF6600" strokeOpacity="0.9" strokeWidth="1" />

                                {/* Floating Point Tracker */}
                                <circle cx="130" cy="35" r="3" fill="#FF6600" />
                                <path d="M130 50L130 40" stroke="#FF6600" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-bold tracking-tight mb-3">Precision tracking</h3>
                            <p className="text-white/50 text-[15px] leading-relaxed font-medium">
                                Stop guessing what works. Track clicks, direct referrer sources, and daily conversions with pinpoint accuracy across your dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col md:pl-10 lg:pl-16">
                        {/* Abstract Wireframe Visual - Network/Broadcast */}
                        <div className="w-full aspect-square max-w-[280px] mx-auto mb-16 relative flex items-center justify-center opacity-80">
                            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                {/* Central Hub (Your Storefront/Email Server) */}
                                <path d="M100 90L125 102.5L100 115L75 102.5L100 90Z" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
                                <path d="M75 102.5V112.5L100 125V115L75 102.5Z" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
                                <path d="M125 102.5V112.5L100 125V115L125 102.5Z" stroke="white" strokeOpacity="0.4" strokeWidth="1" />

                                {/* Radiation lines (Broadcast) */}
                                <path d="M70 95L40 75" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />
                                <path d="M130 95L160 75" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />
                                <path d="M100 85L100 50" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" className="animate-dash" />

                                {/* Audience Nodes (Floating cubes) */}
                                {/* Node 1 Top Left */}
                                <path d="M40 70L50 75L40 80L30 75L40 70Z" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                                {/* Node 2 Top Right */}
                                <path d="M160 70L170 75L160 80L150 75L160 70Z" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                                {/* Node 3 Top Middle */}
                                <path d="M100 40L110 45L100 50L90 45L100 40Z" stroke="#FF6600" strokeOpacity="0.8" strokeWidth="1" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-bold tracking-tight mb-3">Own your audience</h3>
                            <p className="text-white/50 text-[15px] leading-relaxed font-medium">
                                Don't just send tracking clicks away. Capture emails automatically from your storefront and broadcast new affiliate offers to them directly.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
