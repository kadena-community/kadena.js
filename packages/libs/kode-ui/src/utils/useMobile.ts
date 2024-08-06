import { useEffect, useState } from 'react';

/**
 * A hook that returns whether the component is rendered in a mobile browser.
 * It is useful for applying specific styling or UX for mobile or desktop clients.
 */
export function useMobile(): { isMobile: boolean } {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    [
      'Android',
      'webOS',
      'iPhone',
      'iPad',
      'iPod',
      'BlackBerry',
      'Windows Phone',
      'Opera Mini',
      'IEMobile',
      'Mobile',
    ].some((keyword) => setIsMobile(navigator.userAgent.indexOf(keyword) > -1));
  }, []);

  return {
    isMobile,
  };
}
