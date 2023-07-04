import { Button } from '../Button'

import styles from './card.module.scss';

import React, { FC } from 'react';

export interface ICardProps {
  title: string;
  buttonColor?: string;
  buttonText: string;
  isChecked?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: FC<ICardProps> = ({
  title,
  buttonColor,
  buttonText,
  isChecked = true,
  onClick
}) => {
  return (
    <div
      className={`${styles.card} ${!isChecked ? styles.disabled : ''}`}
      onClick={onClick}
    >
      <div>
        <p className={styles['card-title']}>{ title }</p>
        <div className={styles['card-placeholder']}>
          <span style={{ width: '20%' }} />
          <span style={{ width: '75%' }} />
          <span style={{ width: '55%' }} />
          <span style={{ width: '60%' }} />
          <span style={{ width: '55%' }} />
          <span style={{ width: '40%' }} />
          <span style={{ width: '60%' }} />
        </div>
      </div>
      <div className={styles['card-button']}>
        <Button
          type="secondary"
          color={buttonColor}
          aria-label={buttonText}
        >
          { buttonText }
        </Button>
      </div>
    </div>
  );
};