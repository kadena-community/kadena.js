import classNames from 'classnames';
import mermaid from 'mermaid';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import { code, mermaidClass } from './style.css';

mermaid.initialize({
  theme: 'base',
  startOnLoad: true,
  themeVariables: {
    primaryColor: '#2767a3',
    primaryTextColor: '#fff',
    primaryBorderColor: '#fff',
    lineColor: '#fff',
    secondaryColor: '#006100',
  },
});

export const Mermaid: FC<PropsWithChildren> = ({ children, ...props }) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ref.current.innerText;

      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, []);

  return (
    <pre
      ref={ref}
      className={classNames(code, mermaidClass, 'mermaid')}
      {...props}
    >
      {children}
    </pre>
  );
};
