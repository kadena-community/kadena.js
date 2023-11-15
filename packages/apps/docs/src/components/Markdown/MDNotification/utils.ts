import type { INotificationRootProps } from '@kadena/react-ui';
import { SystemIcon } from '@kadena/react-ui';

export type LabelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'caution'
  | 'danger'
  | 'warning';

export const getColor = (
  label?: LabelType,
): INotificationRootProps['color'] => {
  if (!label) return;
  switch (label) {
    case 'tip':
      return 'positive';
    case 'danger':
    case 'warning':
      return 'negative';
    case 'caution':
      return 'warning';
    case 'note':
    case 'info':
    default:
      return 'info';
  }
};

export const getIcon = (label?: LabelType): INotificationRootProps['icon'] => {
  if (!label) return undefined;
  switch (label) {
    case 'caution':
    case 'warning':
    case 'danger':
      return <SystemIcon.Bell />;
    case 'note':
    case 'info':
    case 'tip':
    default:
      return undefined;
  }
};
