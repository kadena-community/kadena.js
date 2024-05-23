import { useEffect } from 'react';

/**
 * This is a fix for the issue that iOS has with automatic zooming when text input fields have focus.
 * https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Safari-Textbox-Zooming
 */
export const useIphoneInputFix = () => {
  useEffect(() => {
    console.log(111);
    if (navigator.userAgent.indexOf('iPhone') === -1) {
      console.log(22);
      document
        ?.querySelector('[name=viewport]')
        ?.setAttribute('content', 'width=device-width, initial-scale=1');
    }
  }, []);
};
