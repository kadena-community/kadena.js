import { analyticsPageView } from '@/utils/analytics';
import { env } from '@/utils/env';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import type { FC } from 'react';
import React, { useEffect } from 'react';

export const Analytics: FC = () => {
  const pathname = usePathname();
  // 👇 send page views when users gets to the landing page
  useEffect(() => {
    if (!env.TRACKING_ID) return;

    gtag('config', env.TRACKING_ID, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      send_page_view: false, //manually send page views to have full control
    });
  }, []);

  useEffect(() => {
    if (!env.TRACKING_ID) return;
    analyticsPageView({
      page_path: pathname ?? window.location.pathname,
      send_to: env.TRACKING_ID,
    });
  }, [pathname]);

  if (!env.TRACKING_ID) {
    return null;
  }
  return (
    <>
      <Script
        rel="dns-prefetch"
        src={`https://www.googletagmanager.com/gtag/js?id=${env.TRACKING_ID}`}
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

            gtag('config', '${env.TRACKING_ID}', {
              'debug_mode': false
            });
          `,
        }}
      />
    </>
  );
};
