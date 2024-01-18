import { analyticsPageView } from '@/utils/analytics';
import { useRouter } from 'next/router';
import Script from 'next/script';
import type { FC } from 'react';
import React, { useEffect } from 'react';

const TRACKING_ID: string = process.env.NEXT_PUBLIC_TRACKING_ID ?? '';

export const Analytics: FC = () => {
  const router = useRouter();
  // 👇 send page views when users gets to the landing page
  useEffect(() => {
    if (!TRACKING_ID) return;

    gtag('config', TRACKING_ID, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      send_page_view: false, //manually send page views to have full control
    });
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      send_to: TRACKING_ID,
    });
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      if (!TRACKING_ID) return;
      // manually send page views
      analyticsPageView({
        page_path: url,
        send_to: TRACKING_ID,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!TRACKING_ID) {
    return null;
  }
  return (
    <>
      <Script
        rel="dns-prefetch"
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
      ></Script>
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());



            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });

            gtag('config', '${TRACKING_ID}', {
              'debug_mode': false
            });
          `,
        }}
      />
    </>
  );
};
