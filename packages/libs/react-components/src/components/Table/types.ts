import { FunctionComponentElement } from 'react';

export type CompoundType<T> =
  | FunctionComponentElement<T>
  | FunctionComponentElement<T>[];
