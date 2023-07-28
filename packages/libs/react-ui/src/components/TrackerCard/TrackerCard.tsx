import { MaskedValue, ProductIcon } from '..';

import {
  CardContainer,
  ContentContainer,
  DataContainer,
  displayVariant,
  gapValueLabelVariant,
  gridVariant,
  LabelTitle,
  LabelValue,
  LabelValueContainer,
  layoutVariant,
  TrackerWarningContainer,
  warningVariant,
} from './TrackerCard.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface ITrackerCardProps {
  labelValues: ILabelValue[];
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
  labelValues,
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
    displayVariant[variant],
    layoutVariant[variant],
    gapValueLabelVariant[variant],
  );

  const classWarningContainer = classNames(
    TrackerWarningContainer,
    warningVariant[helperTextType],
  );

  const Icon = icon;

  return (
    <div className={classCardContainer} data-testid="kda-tracker-card">
      {Icon ? <Icon data-testid="kda-icon" /> : <div />}
      <div className={ContentContainer}>
        <div className={DataContainer} data-testid="kda-data-container">
          {labelValues?.map((item, index) => {
            return (
              <div
                className={classLabelValue}
                key={`label-value-container-${index}`}
                data-testid={`kda-label-value-container-${index}`}
              >
                <div
                  className={LabelTitle}
                  key={`label-${index}`}
                  data-testid={`kda-label-${index}`}
                >
                  {item.label}
                </div>
                {item.isAccount && item.value ? (
                  <MaskedValue
                    value={item.value}
                    defaultVisibility={item.defaultVisible}
                    startUnmaskedValues={item.startUnmasked}
                    endUnmaskedValues={item.endUnmasked}
                    key={`masked-value-${index}`}
                    data-testid={`kda-masked-value-${index}`}
                  />
                ) : (
                  <div
                    className={LabelValue}
                    key={`value-${index}`}
                    data-testid={`kda-value-${index}`}
                  >
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {helperText ? (
          <div className={classWarningContainer} data-testid="kda-helper-text">
            {helperText}
          </div>
        ) : null}
      </div>
    </div>
  );
};
