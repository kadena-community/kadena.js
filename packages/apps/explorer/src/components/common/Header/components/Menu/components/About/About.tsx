import s from '../Network/Network.module.css';

import style from './About.module.css';

import { Route } from 'config/Routes';
import Link from 'next/link';
import React, { FC } from 'react';

const About: FC = () => (
  <div className={`${s.container} ${style.aboutContainer}`}>
    <Link href={Route.About}>
      <a href={Route.About} className={s.row}>
        About Us
      </a>
    </Link>
    <Link href="https://kadena.io/about/">
      <a
        target="_blank"
        href="https://kadena.io/about/"
        className={s.row}
        rel="noreferrer"
      >
        Kadena
      </a>
    </Link>
  </div>
);

export default About;
