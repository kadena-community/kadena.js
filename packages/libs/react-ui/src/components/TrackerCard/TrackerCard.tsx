import classNames from 'classnames';
import type { FC, ReactElement } from 'react';
import React from 'react';
import { MaskedValue } from '..';
import {
  CardContainer,
  ContentContainer,
  DataContainer,
  LabelTitle,
  LabelValue,
  LabelValueContainer,
  TrackerWarningContainer,
  displayVariant,
  gapValueLabelVariant,
  gridVariant,
  layoutVariant,
  warningVariant,
} from './TrackerCard.css';

export interface ITrackerCardProps {
  labelValues: ILabelValue[];
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon: ReactElement;
  variant?: keyof typeof layoutVariant;
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
  variant = 'vertical',
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

  return (
    <div className={classCardContainer} data-testid="kda-tracker-card">
      {icon}
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
