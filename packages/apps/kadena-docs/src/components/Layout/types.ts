import { ReactNode } from 'react';

export interface ILayout {
  children?: ReactNode;
}

export type LayoutType = 'full' | 'code' | 'landing';
