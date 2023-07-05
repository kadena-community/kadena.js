import styles from './builders.module.scss'

import Image from 'next/image'
import React, { FC } from 'react';

export const Builders: FC = () => {

  const contentBuilders = [
    {
      name: 'Clover',
      logo: 'clover.png',
      width: 154,
      height: 122,
      link: 'https://clv.org/'
    },
    {
      name: 'DNA',
      logo: 'dna.png',
      width: 228,
      height: 126,
      link: 'https://thedna.tech/'
    },
    {
      name: 'Flux',
      logo: 'flux.png',
      width: 218,
      height: 126,
      link: 'https://www.runonflux.io/'
    },
  ]

  const buildersLogoFolder = '/builders-logo/';
  return (
    <div className={styles.builders}>
      {
        contentBuilders.map((builder, index) => (
          <a
            href={builder.link}
            target="_blank"
            rel="noreferrer"
            key={index}
          >
            <Image
              width={builder.width}
              height={builder.height}
              alt={builder.name}
              src={buildersLogoFolder + builder.logo}
            />
          </a>
        ))
      }
    </div>
  );
};