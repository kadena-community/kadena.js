import { INotificationProps, SystemIcon } from '@kadena/react-ui';

export type LabelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'caution'
  | 'danger'
  | 'warning';
export type IconType =
  | (typeof SystemIcon)['Information']
  | (typeof SystemIcon)['Bell']
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
      return SystemIcon.Information;
    case 'caution':
    case 'warning':
    case 'danger':
      return SystemIcon.Bell;

    default:
      return undefined;
  }
};
