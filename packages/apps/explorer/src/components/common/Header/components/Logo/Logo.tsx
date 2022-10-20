import React, { FC, memo } from 'react';
import Link from 'next/link';
import { Route } from 'config/Routes';

import s from './Logo.module.css';

const Logo: FC = () => (
  <Link href={Route.Root}>
    <a href={Route.Root} className={s.logo}>
      Kadena
    </a>
  </Link>
);

export default Logo;
