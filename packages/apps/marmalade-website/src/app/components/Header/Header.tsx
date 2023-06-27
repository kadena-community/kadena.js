import { Button } from '../Button';

import styles from './header.module.scss'

import Image from 'next/image'
import React, { FC } from 'react';

export const Header : FC = () => {
  return (
    <header className={`${styles.header} container-inner`}>
      <Image
        className={styles.logo}
        src="/marmalade-logo.svg"
        alt="Marmalade"
        width={285}
        height={55}
        priority
      />
      <nav className={styles.nav}>
        <ul className={styles['nav-items']}>
          <li>Ask me anything</li>
          <li><a href="https://alpha-docs.kadena.io/" target="_blank" rel="noreferrer">Docs</a></li>
        </ul>
        {/* <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}
        <Button href="https://github.com/kadena-io/marmalade/tree/v2">Github</Button>
      </nav>
    </header>
  );
};