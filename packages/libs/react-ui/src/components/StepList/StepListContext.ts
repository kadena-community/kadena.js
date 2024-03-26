import type { StepListState } from '@react-stately/steplist';
import { createContext } from 'react';

export const StepListContext = createContext<StepListState<unknown> | null>(
  null,
);
