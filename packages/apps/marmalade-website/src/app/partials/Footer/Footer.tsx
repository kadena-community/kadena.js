import styles from './footer.module.scss'

import Image from 'next/image'
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container-inner">
        <Image
          src="/marmalade-icon.svg"
          alt="Marmalade"
          width={80}
          height={80}
        />
        <p>Footer</p>
      </div>
    </footer>
  );
};