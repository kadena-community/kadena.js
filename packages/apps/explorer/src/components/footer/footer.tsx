import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { navbarWrapperClass } from '../navbar/styles.css';

const Footer: FC<PropsWithChildren> = () => {
  return (
    <Stack as="footer" className={navbarWrapperClass}>
      <div>sdf</div>
    </Stack>
  );
};

export default Footer;
