import s from '../Network/Network.module.css';

import style from './GetStarted.module.css';

import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  mobileMenu?: string;
}

const GetStarted: FC<IProps> = ({ mobileMenu }) => {
  return (
    <div
      className={`${style.startedContainer} ${
        mobileMenu ? s.dropdownMobileMenu : s.container
      }`}
    >
      <Link
        href={
          'https://github.com/kadena-io/chainweb-miner/blob/master/README.org'
        }
      >
        <a
          href={
            'https://github.com/kadena-io/chainweb-miner/blob/master/README.org'
          }
          className={`${s.row} ${style.startedRow}`}
          target="_blank"
          rel="noreferrer"
        >
          Start Mining
        </a>
      </Link>
      <Link href={'https://docs.kadena.io/basics/wallets'}>
        <a
          href={'https://docs.kadena.io/basics/wallets'}
          className={`${s.row} ${style.startedRow}`}
          target="_blank"
          rel="noreferrer"
        >
          Download Wallet
        </a>
      </Link>
      <Link href={'http://testnet.chainweb.com/games/'}>
        <a
          href={'http://testnet.chainweb.com/games/'}
          className={`${s.row} ${style.startedRow}`}
          target="_blank"
          rel="noreferrer"
        >
          Play Testnet Games
        </a>
      </Link>
      <Link
        href={
          'https://explorer.chainweb.com/static/1yn6gn2s00b6qzmirgy2d5a3smkqd6lkjhj8p1sc85nix5y0w2bm-chains-3d.html'
        }
      >
        <a
          href={
            'https://explorer.chainweb.com/static/1yn6gn2s00b6qzmirgy2d5a3smkqd6lkjhj8p1sc85nix5y0w2bm-chains-3d.html'
          }
          className={`${s.row} ${style.startedRow}`}
          target="_blank"
          rel="noreferrer"
        >
          See Chains in 3D (experimental)
        </a>
      </Link>
      <Link href={'https://shadena.kate.land/'}>
        <a
          href={'https://shadena.kate.land/'}
          className={`${s.row} ${style.startedRow}`}
          target="_blank"
          rel="noreferrer"
        >
          Check Shadena Tool
        </a>
      </Link>
    </div>
  );
};

export default GetStarted;
