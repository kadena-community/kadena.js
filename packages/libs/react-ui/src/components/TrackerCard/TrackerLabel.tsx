import classNames from 'classnames';
import React from 'react';
import { MaskedValue } from '..';
import {
  displayVariant,
  gapValueLabelVariant,
  LabelTitle,
  LabelValue,
  LabelValueContainer,
  layoutVariant,
} from './TrackerCard.css';
export interface ILabelValue {
  label: string;
  value?: string;
  isAccount?: boolean;
  defaultVisible?: boolean;
  startUnmasked?: number;
  endUnmasked?: number;
}

export const TrackerLabel = ({
  item,
  index,
  variant = 'vertical',
}: {
  item: ILabelValue;
  index: number;
  variant?: keyof typeof layoutVariant;
}) => {
  const classLabelValue = classNames(
    LabelValueContainer,
    displayVariant[variant],
    layoutVariant[variant],
    gapValueLabelVariant[variant],
  );
  return (
    <div
      className={classLabelValue}
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
};
