import styles from './footer.module.css'

import Image from 'next/image'
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <Image
        src="/icon.svg"
        alt="Marmalade"
        width={80}
        height={80}
      />
      <p>Footer</p>
    </footer>
  );
};