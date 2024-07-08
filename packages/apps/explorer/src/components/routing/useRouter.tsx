import { useNetwork } from '@/context/networks-context';
import { useRouter as NextUseRouter } from 'next/router';
import { createHref } from './utils';

export const useRouter = () => {
  const { activeNetwork } = useNetwork();
  const router = NextUseRouter();

  const replace = (href: string): Promise<boolean> => {
    return router.replace(createHref(activeNetwork, href));
  };
  const push = (href: string): Promise<boolean> => {
    return router.push(createHref(activeNetwork, href));
  };

  return { ...router, replace, push };
};
