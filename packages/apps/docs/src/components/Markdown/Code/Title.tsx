import { MonoContentCopy } from '@kadena/react-icons';
import { Button, Stack } from '@kadena/react-ui';
import type { FC, ReactNode } from 'react';
import React, { useRef } from 'react';
import { codeTitle, codeWrapper, copyButtonClass } from './style.css';

interface IProp {
  children: ReactNode;
  'data-language'?: string;
}

export const TitleWrapper: FC<IProp> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (!ref.current) return;

    const codePre = ref.current.parentElement?.querySelector('pre');
    await navigator.clipboard.writeText(codePre?.innerText ?? '');
  };

  if (props.hasOwnProperty('data-rehype-pretty-code-fragment')) {
    return (
      <div className={codeWrapper} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={codeTitle} {...props}>
      <Stack>
        {children} {props['data-language']}
      </Stack>
      <Stack flex={1} />
      <Stack>
        <Button
          className={copyButtonClass}
          onClick={handleCopy}
          variant="transparent"
        >
          <MonoContentCopy />
        </Button>
      </Stack>
    </div>
  );
};
