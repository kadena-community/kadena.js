import {
  MonoContrast,
  MonoDarkMode,
  MonoLightMode,
} from '@kadena/kode-icons/system';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';
import React from 'react';
import { Stack } from './../../..';
import type { Themes } from './../../../../utils/useTheme/utils/constants';

export interface IThemeAnimateIconProps {
  theme?: keyof typeof Themes;
}

export const ThemeAnimateIcon: FC<IThemeAnimateIconProps> = ({
  theme = 'system',
}) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      position="relative"
      style={{
        width: '24px',
        height: '24px',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {theme === 'dark' || theme === 'light' ? (
          <motion.div
            key={theme}
            initial={{
              opacity: 0,
              rotate: -90,

              transformOrigin: '100% 200%',
            }}
            animate={{
              opacity: 1,
              rotate: 0,
            }}
            exit={{
              opacity: 0,
              rotate: 90,
              transformOrigin: '-250% 300%',
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
            style={{
              translate: '0px 0px',
              position: 'absolute',
            }}
          >
            {theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />}
          </motion.div>
        ) : (
          <motion.div
            key={theme}
            initial={{
              opacity: 0,
              translateY: '20px',
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              translateY: '0px',
              rotate: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              translateY: '20px',
              scale: 0.6,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
            }}
            style={{
              translate: '0px 0px',
              position: 'absolute',
            }}
          >
            <MonoContrast />
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};
