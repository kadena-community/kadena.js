import classNames from 'classnames';
import { MaskedValue } from '..';
import { SystemIcon } from '../Icons';

import {
  CardContainer,
  DataContainer,
  ContentContainer,
  LabelTitle,
  LabelValue,
  TrackerWarningContainer,
  layoutVariant,
  gridVariant,
  LabelValueContainer,
} from './TrackerCard.css';

import React, { FC, useState } from 'react';

export interface ITrackerCardProps {
  labelValue: ILabelValue[];
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon?: JSX.Element;
  variant: keyof typeof layoutVariant;
}

export interface ILabelValue {
  label: string;
  value?: string;
  isAccount?: boolean;
  defaultVisible?: boolean;
  startUnmasked?: number;
  endUnmasked?: number;
}

export const TrackerCard: FC<ITrackerCardProps> = ({
  labelValue,
  icon,
  helperText,
  helperTextType = 'mild',
  variant,
}): JSX.Element => {
  const classCardContainer = classNames(
    CardContainer,
    layoutVariant[variant],
    gridVariant[variant],
  );

  const classlabelValue = classNames(ContentContainer, layoutVariant[variant]);

  return (
    <div className={classCardContainer}>
      {icon}
      <div className={ContentContainer}>
        <div className={DataContainer}>
          {labelValue.map((item, index) => {
            return (
              <div>
                {item.isAccount && item.value ? (
                  <MaskedValue
                    value={item.value}
                    title={item.label}
                    defaultVisibility={item.defaultVisible}
                    startUnmaskedValues={item.startUnmasked}
                    endUnmaskedValues={item.endUnmasked}
                    key={index}
                  />
                ) : (
                  <div className={LabelValueContainer}>
                    <div className={LabelTitle} key={index}>
                      {item.label}
                    </div>
                    <div className={LabelValue} key={index}>
                      {item.value}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {helperText ? (
          <div className={TrackerWarningContainer}>{helperText}</div>
        ) : null}
      </div>
    </div>
  );
};
