import React, { FC, memo } from 'react';
import Link from 'next/link';
import { Route } from 'config/Routes';

import style from './About.module.css';
import s from '../Network/Network.module.css';

const About: FC = () => {
  return (
    <div className={`${s.container} ${style.aboutContainer}`}>
      <Link href={Route.About}>
        <a href={Route.About} className={s.row}>
          About Us
        </a>
      </Link>
      <Link href="https://kadena.io/about/">
        <a target="_blank" href="https://kadena.io/about/" className={s.row}>
          Kadena
        </a>
      </Link>
    </div>
  );
};

export default About;
