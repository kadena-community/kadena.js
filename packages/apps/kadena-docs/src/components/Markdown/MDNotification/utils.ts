import { INotificationProps, SystemIcons } from '@kadena/react-components';

export type LabelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'caution'
  | 'danger'
  | 'warning';
export type IconType =
  | (typeof SystemIcons)['Information']
  | (typeof SystemIcons)['Bell']
  | undefined;

export const getColor = (label?: LabelType): INotificationProps['color'] => {
  if (!label) return;
  switch (label) {
    case 'note':
    case 'info':
      return 'primary';
    case 'tip':
      return 'positive';
    case 'danger':
    case 'warning':
      return 'negative';
    case 'caution':
      return 'warning';
    default:
      return 'primary';
  }
};

export const getIcon = (label?: LabelType): IconType => {
  if (!label) return undefined;
  switch (label) {
    case 'note':
    case 'info':
    case 'tip':
      return SystemIcons.Information;
    case 'caution':
    case 'warning':
    case 'danger':
      return SystemIcons.Bell;

    default:
      return undefined;
  }
};
