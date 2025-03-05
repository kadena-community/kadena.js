import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { useLayout } from '../LayoutProvider';
import { Stack, Text } from './../../../../components';
import { footerClass, footerContentClass } from './style.css';

export const Footer: FC = () => {
  const { setFooterContentRef } = useLayout();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setFooterContentRef(contentRef.current);
  }, [contentRef.current]);
  return (
    <Stack className={footerClass} width="100%" padding="md" gap="xs">
      <Text>
        Powered by{' '}
        <a href="https://kadena.io" target="_blank" rel="noreferrer">
          kadena.io
        </a>
      </Text>

      <Stack flex={1}>
        <Stack ref={contentRef} />
      </Stack>

      <Stack className={footerContentClass}>
        <a href="https://discord.com/invite/kadena">Discord</a>
        <a href="https://docs.kadena.io">Help</a>
        <a href="https://www.kadena.io/privacy-policy">Privacy</a>
        <a href="https://www.kadena.io/terms-and-conditions">Terms</a>
      </Stack>
    </Stack>
  );
};
