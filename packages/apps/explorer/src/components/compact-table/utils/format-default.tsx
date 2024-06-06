import type { FC } from 'react';
import React from 'react';

interface IProps {
  value: string;
}

export const FormatDefault: FC<IProps> = ({ value }) => <>{value}</>;
