import type { vars } from '@theme/vars.css';

import { createContext } from 'react';
import type { FormFieldStatus } from '../Form.css';

export type OpenSections = string[];

interface IInputWrapperContext {
  status?: FormFieldStatus;
  leadingTextWidth?: keyof typeof vars.sizes;
}

export const InputWrapperContext = createContext<IInputWrapperContext>({
  status: undefined,
  leadingTextWidth: undefined,
});
