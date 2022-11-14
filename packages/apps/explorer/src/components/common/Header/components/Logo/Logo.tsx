import s from './Logo.module.css';

import { Route } from 'config/Routes';
import Link from 'next/link';
import React, { FC } from 'react';

const Logo: FC = () => (
  <Link href={Route.Root}>
    <a href={Route.Root} className={s.logo}>
      Kadena
    </a>
  </Link>
);

export default Logo;
