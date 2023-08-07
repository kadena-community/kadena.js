import { code, codeLine, codeWord, inlineCode } from './style.css';

import { useTheme } from '@/hooks';
import React, { FC, ReactNode, useEffect } from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  const { theme } = useTheme();

  const [themedProps, setThemedProps] = React.useState(props);

  useEffect(() => {
    setThemedProps({
      ...props,
      'data-active-theme': theme,
    });
  }, [props, theme]);

  if (typeof children === 'string') {
    return <code className={inlineCode}>{children}</code>;
  }

  return (
    <code className={code} {...themedProps}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || !child) {
          return null;
        }

/*
        const grandchildren = React.Children.map(
          child.props.children,
          (grandchild: ReactNode) => {
            if (!React.isValidElement(grandchild) || !grandchild) {
              return null;
            }

            return React.cloneElement(grandchild, {
              ...grandchild.props,
              className: codeWord,
            });
          },
        );
*/

        return React.cloneElement(child, {
          ...child.props,
          className: codeLine,
          // children: grandchildren,
        });
      })}
    </code>
  );
};
