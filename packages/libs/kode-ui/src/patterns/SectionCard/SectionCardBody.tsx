import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { bodyClass } from './style.css';

export interface ISectionCardBodyProps extends PropsWithChildren {}

export const SectionCardBody: FC<ISectionCardBodyProps> = ({ children }) => {
  return <Stack className={bodyClass}>{children}</Stack>;
};
