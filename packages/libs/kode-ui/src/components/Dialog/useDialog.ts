import { useContext } from 'react';
import type { IDialogContext } from './Dialog.context';
import { DialogContext } from './Dialog.context';

export const useDialog = (): IDialogContext => useContext(DialogContext);
