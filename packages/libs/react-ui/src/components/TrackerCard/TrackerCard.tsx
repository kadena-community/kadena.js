import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { ProductIcon } from '..';
import {
  CardContainer,
  ContentContainer,
  DataContainer,
  gridVariant,
  layoutVariant,
  TrackerWarningContainer,
  warningVariant,
} from './TrackerCard.css';
import { ILabelValue, TrackerLabel } from './TrackerLabel';

export interface ITrackerCardProps {
  labelValues: ILabelValue[];
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon?: keyof typeof ProductIcon;
  variant?: keyof typeof layoutVariant;
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

  const classWarningContainer = classNames(
    TrackerWarningContainer,
    warningVariant[helperTextType],
  );

  const Icon = icon && ProductIcon[icon];

  return (
    <div className={classCardContainer} data-testid="kda-tracker-card">
      {Icon ? <Icon data-testid="kda-icon" size="xl" /> : null}
      <div className={ContentContainer}>
        <div className={DataContainer} data-testid="kda-data-container">
          {labelValues?.map((item, index) => (
            <TrackerLabel
              key={`label-value-container-${index}`}
              item={item}
              index={index}
              variant={variant}
            />
          ))}
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
