import classNames from 'classnames';
import { MaskedValue, ProductIcon } from '..';

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
  gapValueLabelVariant,
  displayVarant,
  warningVariant,
} from './TrackerCard.css';

import React, { FC } from 'react';

export interface ITrackerCardProps {
  labelValue: ILabelValue[];
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon?: (typeof ProductIcon)[keyof typeof ProductIcon];
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
    icon ? layoutVariant[variant] : null,
    gridVariant[variant],
  );

  const classLabelValue = classNames(
    LabelValueContainer,
    displayVarant[variant],
    layoutVariant[variant],
    gapValueLabelVariant[variant],
  );

  const classWarningContainer = classNames(
    TrackerWarningContainer,
    warningVariant[helperTextType],
  );

  const Icon = icon;

  return (
    <div className={classCardContainer}>
      {Icon ? (
        <>
          <Icon />
        </>
      ) : (
        <div />
      )}
      <div className={ContentContainer}>
        <div className={DataContainer}>
          {labelValue?.map((item, index) => {
            return (
              <div className={classLabelValue}>
                <div className={LabelTitle} key={`label-${index}`}>
                  {item.label}
                </div>
                {item.isAccount && item.value ? (
                  <MaskedValue
                    value={item.value}
                    defaultVisibility={item.defaultVisible}
                    startUnmaskedValues={item.startUnmasked}
                    endUnmaskedValues={item.endUnmasked}
                    key={`masked-value-${index}`}
                  />
                ) : (
                  <div className={LabelValue} key={`value-${index}`}>
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {helperText ? (
          <div className={classWarningContainer}>{helperText}</div>
        ) : null}
      </div>
    </div>
  );
};
