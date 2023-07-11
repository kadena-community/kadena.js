import { MaskedValue } from '..';
import { SystemIcon } from '../Icons';

import {
  CardContainer,
  TrackerInfoContainer,
  TrackerContentContainer,
  TrackerInfoItemTitle,
  TrackerInfoItemLine,
  TrackerWarningContainer,
} from './TrackerCard.css';

import React, { FC, useState } from 'react';

export interface ITrackerCardProps {
  labelValue: ITrackerCardLabel[];
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon?: JSX.Element;
}

export interface ITrackerCardLabel {
  label: string;
  value?: string;
  isAccount?: boolean;
}

export const TrackerCard: FC<ITrackerCardProps> = ({
  labelValue,
  icon,
  helperText,
  helperTextType = 'mild',
}): JSX.Element => {
  return (
    <div className={CardContainer}>
      {icon}
      <div className={TrackerInfoContainer}>
        {isAccount ? (
          <MaskedValue value={firstContent} title={firstTitle} />
        ) : (
          <div>
            <div className={TrackerInfoItemTitle}>{firstTitle}</div>
            <div className={TrackerInfoItemLine}>{firstContent}</div>
          </div>
        )}
        <div className={TrackerContentContainer}>
          <div>
            <div className={TrackerInfoItemTitle}>{secondTitle}</div>
            <div className={TrackerInfoItemLine}>{secondContent}</div>
          </div>
          {helperText ? (
            <div className={TrackerWarningContainer}>{helperText}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
