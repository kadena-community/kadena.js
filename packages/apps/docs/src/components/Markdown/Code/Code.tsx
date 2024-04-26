import type { FC, ReactNode } from 'react';
import React from 'react';
import { Mermaid } from './Mermaid';
import { code, codeLine, inlineCode } from './style.css';

interface IProp {
  children: ReactNode;
  'data-language'?: string;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  const language = props && props['data-language'];

  if (typeof children === 'string') {
    return <code className={inlineCode}>{children}</code>;
  }

  if (language?.toLowerCase() === 'mermaid') {
    return <Mermaid {...props}>{children}</Mermaid>;
  }
  return (
    <code className={code} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || !child) {
          return null;
        }

        return (
          <span {...props} className={codeLine}>
            <span>{child}</span>
          </span>
        );
      })}
    </code>
  );
};
