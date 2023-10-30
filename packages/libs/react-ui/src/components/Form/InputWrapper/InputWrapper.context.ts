import type { vars } from '@theme/vars.css';

import { createContext } from 'react';
import type { Status } from '../Form.css';

export type OpenSections = string[];

interface IInputWrapperContext {
  status?: Status;
  leadingTextWidth?: keyof typeof vars.sizes;
}

export const InputWrapperContext = createContext<IInputWrapperContext>({
  status: undefined,
  leadingTextWidth: undefined,
});
