import { DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import React, { FC, useEffect, useState } from 'react';

export const ThemeProvider: FC = (props: any) => {
  //const isDark = useDarkMode();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const key = 'sb-addon-themes-3';

    const store = JSON.parse(localStorage.getItem(key) ?? '{}');
    setIsDark(store.current === 'dark');

    const listener = (event) => {
      if (event.key !== key) return;
      const values = JSON.parse(event.newValue ?? '{}');

      setIsDark(values.current === 'dark');
    };

    addEventListener('storage', listener);

    return () => {
      removeEventListener('storage', listener);
    };
  }, []);

  return (
    <DocsContainer {...props} theme={isDark ? themes.dark : themes.light}>
      {props.children}
    </DocsContainer>
  );
};
