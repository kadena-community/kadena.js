import { MonoCheck, MonoContentCopy } from '@kadena/react-icons';
import { Button, Stack } from '@kadena/react-ui';
import type { FC, ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import {
  codeTitle,
  codeWrapper,
  copyButtonClass,
  okCopiedClass,
} from './style.css';

interface IProp {
  children: ReactNode;
  'data-language'?: string;
}

export const TitleWrapper: FC<IProp> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    if (!ref.current) return;

    const codePre = ref.current.parentElement?.querySelector('pre');
    await navigator.clipboard.writeText(codePre?.innerText ?? '');

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }, [setIsCopied]);

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
          aria-label="Copy code"
        >
          {isCopied ? (
            <MonoCheck className={okCopiedClass} />
          ) : (
            <MonoContentCopy />
          )}
        </Button>
      </Stack>
    </div>
  );
};
