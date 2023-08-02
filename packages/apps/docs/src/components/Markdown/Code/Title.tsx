import { codeTitle, codeWrapper } from './style.css';

import { useTheme } from '@/hooks';
import React, { FC, ReactNode, useEffect } from 'react';

interface IProp {
  children: ReactNode;
}

export const TitleWrapper: FC<IProp> = ({ children, ...props }) => {
  const { theme } = useTheme();

  const [themedProps, setThemedProps] = React.useState(props);

  useEffect(() => {
    setThemedProps({
      ...props,
      'data-active-theme': theme,
    });
  }, [props, theme]);

  if (props.hasOwnProperty('data-rehype-pretty-code-fragment')) {
    return (
      <div className={codeWrapper} {...themedProps}>
        {children}
      </div>
    );
  }

  return (
    <div className={codeTitle} {...themedProps}>
      {children}
    </div>
  );
};
