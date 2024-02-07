'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import { SystemIcon } from '../Icon';
import {
  iconContainer,
  titleContainer,
  valueContainer,
  valueIconContainer,
} from './MaskedValue.css';
import { maskValue } from './utils';

export interface IMaskedValueProps {
  title?: string;
  value: string;
  defaultVisibility?: boolean;
  startUnmaskedValues?: number;
  endUnmaskedValues?: number;
  maskCharacter?: string;
  maskLength?: number;
}

export const MaskedValue: FC<IMaskedValueProps> = ({
  title,
  value,
  defaultVisibility = false,
  startUnmaskedValues = 6,
  endUnmaskedValues = 4,
  maskCharacter = '*',
  maskLength = 4,
}): JSX.Element => {
  const [visible, setVisible] = useState(defaultVisibility);

  const toggleVisibility = (): void => {
    setVisible(!visible);
  };

  const maskedValue = maskValue(value, {
    headLength: startUnmaskedValues,
    tailLength: endUnmaskedValues,
    character: maskCharacter,
    maskLength,
  });

  return (
    <div data-testid="kda-masked-value">
      <div className={titleContainer}>{title}</div>
      <div className={valueIconContainer}>
        <div className={valueContainer}>{visible ? value : maskedValue}</div>
        {visible ? (
          <SystemIcon.EyeOffOutline
            className={iconContainer}
            onClick={toggleVisibility}
          />
        ) : (
          <SystemIcon.EyeOutline
            className={iconContainer}
            onClick={toggleVisibility}
          />
        )}
      </div>
    </div>
  );
};
