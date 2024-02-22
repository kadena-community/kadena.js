import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account && isMounted) {
      login();
    }
  }, [account, isMounted, router, login]);

  if (!account) return null;

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
