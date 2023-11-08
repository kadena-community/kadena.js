import type { FC } from 'react';
import type { IDialogContentProps } from './DialogContent';
import { DialogContent } from './DialogContent';
import type { IDialogFooterProps } from './DialogFooter';
import { DialogFooter } from './DialogFooter';
import type { IDialogHeaderProps } from './DialogHeader';
import { DialogHeader } from './DialogHeader';
import type { IDialogRootProps } from './DialogRoot';
import { DialogRoot } from './DialogRoot';

export {
  IDialogContentProps,
  IDialogFooterProps,
  IDialogHeaderProps,
  IDialogRootProps,
};

interface IDialogProps {
  Root: FC<IDialogRootProps>;
  Header: FC<IDialogHeaderProps>;
  Content: FC<IDialogContentProps>;
  Footer: FC<IDialogFooterProps>;
}

export const Dialog: IDialogProps = {
  Root: DialogRoot,
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
};
