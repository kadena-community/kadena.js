import React, { FC, memo } from 'react';
import Link from 'next/link';
import { Route } from 'config/Routes';

import s from '../Network/Network.module.css';
import style from './LearnMore.module.css';

interface IProps {
  mobileMenu?: string;
}

const LearnMore: FC<IProps> = ({ mobileMenu }) => {
  return (
    <div
      className={`${mobileMenu ? s.dropdownMobileMenu : s.container} ${
        style.learnContainer
      }`}>
      <Link href={'https://docs.kadena.io/'}>
        <a className={`${s.row} ${style.learnRow}`} target="_blank">
          Kadena Docs
        </a>
      </Link>
      <Link href={'https://docs.kadena.io/basics/whitepapers/overview'}>
        <a className={`${s.row} ${style.learnRow}`} target="_blank">
          Kadena Whitepapers
        </a>
      </Link>
      <Link href={Route.Charts}>
        <a className={`${s.row} ${style.learnRow}`} target="_blank">
          Kadena Charts
        </a>
      </Link>
    </div>
  );
};

export default memo(LearnMore);
