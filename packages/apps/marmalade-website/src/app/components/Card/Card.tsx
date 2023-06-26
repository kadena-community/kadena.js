import { Button } from '../Button'

import styles from './card.module.css';

import React, { FC } from 'react';

export interface ICardProps {
  title: string;
  buttonColor?: string;
  buttonText: string;
}

export const Card: FC<ICardProps> = ({
  title,
  buttonColor,
  buttonText
}) => {
  return (
   <div className={styles.card}>
    <div>
      <p className={styles['card-title']}>{ title }</p>
      <div className={styles['box-placeholder']}>
        <span className={styles['placeholder-text']} style={{ width: '20%' }} />
        <span className={styles['placeholder-text']} style={{ width: '75%' }} />
        <span className={styles['placeholder-text']} style={{ width: '55%' }} />
        <span className={styles['placeholder-text']} style={{ width: '60%' }} />
        <span className={styles['placeholder-text']} style={{ width: '55%' }} />
        <span className={styles['placeholder-text']} style={{ width: '40%' }} />
        <span className={styles['placeholder-text']} style={{ width: '60%' }} />
      </div>
    </div>
    <div className={styles['card-button']}>
      <Button href="#" type="secondary" color={buttonColor}>{ buttonText }</Button>
    </div>
   </div>
  );
};