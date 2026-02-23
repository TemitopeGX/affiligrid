'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AppPixelTracker({ fbPixelId, gaId }: { fbPixelId?: string | null, gaId?: string | null }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Trigger PageView on route change (for GA/FB)
    useEffect(() => {
        if (pathname) {
            // Google Analytics
            if (gaId && typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('config', gaId, {
                    page_path: pathname,
                });
            }
            // Facebook Pixel
            if (fbPixelId && typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'PageView');
            }
        }
    }, [pathname, searchParams, fbPixelId, gaId]);

    return (
        <>
            {/* Google Analytics */}
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${gaId}');
                        `}
                    </Script>
                </>
            )}

            {/* Facebook Pixel */}
            {fbPixelId && (
                <Script id="facebook-pixel" strategy="afterInteractive">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${fbPixelId}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}
        </>
    );
}
