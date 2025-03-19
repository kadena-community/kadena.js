import { Card, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useCardLayout } from './CardLayoutProvider';

export const InnerContent: FC<PropsWithChildren> = ({ children }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const { content, setFooterContentRef } = useCardLayout();

  useEffect(() => {
    if (!footerRef.current) return;
    setFooterContentRef(footerRef.current);
  }, [footerRef.current]);

  return (
    <Card fullWidth>
      <CardContentBlock
        title={content.label}
        description={content.description}
        supportingContent={content.supportingContent}
        visual={
          <Stack position="relative" style={{ height: '40px' }}>
            <AnimatePresence mode="sync">
              <motion.div
                layout
                key={content.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1, translateX: 50 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute' }}
              >
                {content.visual}
              </motion.div>
            </AnimatePresence>
          </Stack>
        }
      >
        {children}
      </CardContentBlock>
      <Stack ref={footerRef} width="100%" />
    </Card>
  );
};
