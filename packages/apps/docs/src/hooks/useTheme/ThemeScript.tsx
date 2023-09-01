import { type IThemeProviderProps } from './types';
import { colorSchemes, MEDIA } from './utils';

import React, { memo } from 'react';

export const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    attrs,
    nonce,
  }: IThemeProviderProps & { attrs: string[]; defaultTheme: string }) => {
    const defaultSystem = defaultTheme === 'system';

    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === 'class') {
        const removeClasses = `c.remove(${attrs
          .map((t: string) => `'${t}'`)
          .join(',')})`;

        return `var d=document.documentElement,c=d.classList;${removeClasses};`;
      } else {
        return `var d=document.documentElement,n='${attribute}',s='setAttribute';`;
      }
    })();

    const fallbackColorScheme = (() => {
      if (!enableColorScheme) {
        return '';
      }

      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;

      if (fallback) {
        return `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${defaultTheme}'`;
      } else {
        return `if(e==='light'||e==='dark')d.style.colorScheme=e`;
      }
    })();

    const updateDOM = (
      name: string,
      literal: boolean = false,
      setColorScheme = true,
    ): string => {
      const resolvedName = value ? value[name] : name;
      const val = literal ? `${name}|| ''` : `'${resolvedName}'`;
      let text = '';

      // MUCH faster to set colorScheme alongside HTML attribute/class
      // as it only incurs 1 style recalculation rather than 2
      // This can save over 250ms of work for pages with big DOM
      if (
        enableColorScheme &&
        setColorScheme &&
        !literal &&
        colorSchemes.includes(name)
      ) {
        text += `d.style.colorScheme = '${name}';`;
      }

      if (attribute === 'class') {
        if (literal || resolvedName) {
          text += `c.add(${val})`;
        } else {
          text += `null`;
        }
      } else {
        if (resolvedName) {
          text += `d[s](n,${val})`;
        }
      }

      return text;
    };

    const scriptSrc = (() => {
      if (forcedTheme) {
        return `!function(){${optimization}${updateDOM(forcedTheme)}}()`;
      }

      if (enableSystem) {
        return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if('system'===e||(!e&&${defaultSystem})){var t='${MEDIA}',m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
          'dark',
        )}}else{${updateDOM('light')}}}else if(e){${
          value ? `var x=${JSON.stringify(value)};` : ''
        }${updateDOM(value ? `x[e]` : 'e', true)}}${
          !defaultSystem ? `else{${updateDOM(defaultTheme, false, false)}}` : ''
        }${fallbackColorScheme}}catch(e){}}()`;
      }

      return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if(e){${
        value ? `var x=${JSON.stringify(value)};` : ''
      }${updateDOM(value ? `x[e]` : 'e', true)}}else{${updateDOM(
        defaultTheme,
        false,
        false,
      )};}${fallbackColorScheme}}catch(t){}}();`;
    })();

    return (
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: scriptSrc }} />
    );
  },
  // Never re-render this component
  () => true,
);

ThemeScript.displayName = 'ThemeScript';
