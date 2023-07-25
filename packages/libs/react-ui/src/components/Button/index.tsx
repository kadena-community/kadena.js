import type { IButtonProps } from './Button';
import { Button as ButtonContainer } from './Button';
import type { IButtonIconProps } from './ButtonIcon';
import { ButtonIcon } from './ButtonIcon';

import { FC } from 'react';

interface IButton {
  Root: FC<IButtonProps>;
  Icon: FC<IButtonIconProps>;
}

export type { IButtonProps };
export const Button: IButton = {
  Root: ButtonContainer,
  Icon: ButtonIcon,
};
