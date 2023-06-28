import styles from './icon.module.scss'
import Image from 'next/image'

import React, { FC } from 'react'

export interface IIconProps {
  name: string;
  color?: string;
  size?: string;
}

export const Icon: FC<IIconProps> = ({
  name,
  color,
  size
}) => {
  const sizeInPx = (size === 'lg') ? 50 : 28;
  return (
    <div
      className={`
        ${styles.icon}
        ${color ? styles[`${color}`] : ''}
        ${size ? styles[`${size}`] : ''}
      `}
    >
      <Image
        src={`/icons/${name}.svg`}
        alt={name}
        width={sizeInPx}
        height={sizeInPx}
      />
    </div>
  );
};
