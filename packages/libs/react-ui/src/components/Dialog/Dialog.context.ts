import type { DOMAttributes } from '@react-types/shared';
import { createContext } from 'react';

interface IDialogContext {
  titleProps: DOMAttributes;
}
export const DialogContext = createContext<IDialogContext>({
  titleProps: {},
});
