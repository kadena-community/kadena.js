import { useAccount } from '@/hooks/account';
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
      style={{ position: 'absolute', width: '100%', paddingInline: '20px' }}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default UserLayout;
