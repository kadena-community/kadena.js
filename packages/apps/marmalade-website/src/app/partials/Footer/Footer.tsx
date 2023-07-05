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
        <p className={styles.desc}>Marmalade is created with love for the NFT community by <a href="https://kadena.io/" target="_blank" rel="noreferrer">Kadena.io</a> &copy; 2023</p>
        <div className={styles.links}>
          <div>
            <div className={styles.group}>
              <h4>Resources</h4>
              <a href="https://kadena.io/">Lorem ipsum</a>
              <a href="https://kadena.io/">Lorem ipsum</a>
            </div>
          </div>
          <div>
            <div className={styles.group}>
              <h4>Resources</h4>
              <a href="https://kadena.io/">Lorem ipsum</a>
              <a href="https://kadena.io/">Lorem ipsum</a>
            </div>
            <div className={styles.group}>
              <h4>Resources</h4>
              <a href="https://kadena.io/">Lorem ipsum</a>
              <a href="https://kadena.io/">Lorem ipsum</a>
            </div>
          </div>
          <div>
            <div className={styles.group}>
              <h4>Resources</h4>
              <a href="https://kadena.io/">Lorem ipsum</a>
              <a href="https://kadena.io/">Lorem ipsum</a>
            </div>
          </div>
          <div>
            <div className={styles.group}>
              <h4>Resources</h4>
              <a href="https://kadena.io/">Lorem ipsum</a>
              <a href="https://kadena.io/">Lorem ipsum</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};