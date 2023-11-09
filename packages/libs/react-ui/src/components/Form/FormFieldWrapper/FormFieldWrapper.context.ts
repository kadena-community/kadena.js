import type { vars } from '@theme/vars.css';

import { createContext } from 'react';
import type { FormFieldStatus } from '../Form.css';

export type OpenSections = string[];

interface IFormFieldWrapperContext {
  status?: FormFieldStatus;
  leadingTextWidth?: keyof typeof vars.sizes;
}

export const FormFieldWrapperContext = createContext<IFormFieldWrapperContext>({
  status: undefined,
  leadingTextWidth: undefined,
});
