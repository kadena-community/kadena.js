import { Stack } from '@kadena/kode-ui';
import { motion } from 'framer-motion';
import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.div
      style={{ position: 'absolute', width: '100%' }}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <Stack display="flex" flexDirection="column" width="100%">
        {children}
      </Stack>
    </motion.div>
  );
};

export default UserLayout;
