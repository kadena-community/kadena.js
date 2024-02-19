import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import { floatClass } from './style.css';

interface IProps extends PropsWithChildren {
  href: string;
}

export const FloatButton: FC<IProps> = ({ href, children }) => {
  return (
    <motion.div layout layoutId="floatButton" className={floatClass}>
      <Link href={href}>{children}</Link>
    </motion.div>
  );
};
