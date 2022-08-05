import React, { FC, memo } from 'react';
import Link from 'next/link';
import s from './Logo.module.css';
import { Route } from '../../../../../config/Routes';

const Logo: FC = () => {
  return (
    <Link href={Route.Root}>
      <a href={Route.Root} className={s.logo}>
        Kadena
      </a>
    </Link>
  );
};

export default memo(Logo);
