import { Editor } from '@/components/Editor/Editor';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { code, codeLine, inlineCode } from './style.css';

interface IProp {
  children: ReactNode;
  'data-theme': string;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInteractive, setInterctive] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    if (ref.current.innerText.includes('# interactive')) {
      setInterctive(true);
    }
  }, [ref]);

  if (isInteractive) {
    if (props['data-theme'] === theme.theme) return <Editor></Editor>;
  }

  if (typeof children === 'string') {
    return <code className={inlineCode}>{children}</code>;
  }

  return (
    <code ref={ref} className={code} {...props}>
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
