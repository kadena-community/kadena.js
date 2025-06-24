import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons';
import type { Themes } from '@kadena/kode-ui';
import { Stack } from '@kadena/kode-ui';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';

interface IProps {
  theme?: keyof typeof Themes;
}

export const ThemeAnimateIcon: FC<IProps> = ({ theme = 'system' }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      position="relative"
      style={{ width: '24px', height: '24px', overflow: 'hidden' }}
    >
      <AnimatePresence>
        <motion.div
          key={theme}
          initial={{
            opacity: 0,
            rotate: -200,
          }}
          animate={{
            opacity: 1,
            rotate: -110,
          }}
          exit={{
            opacity: 0,
            rotate: -20,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            translate: '15px 16px',
            position: 'absolute',
            transformOrigin: '-5px 5px',
          }}
        >
          {theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />}
        </motion.div>
      </AnimatePresence>
    </Stack>
  );
};
