import { Button as ButtonContainer, IButtonProps } from './Button';
import { ButtonIcon, IButtonIconProps } from './ButtonIcon';

import { FC } from 'react';

export { IButtonProps };
interface IButton extends FC<IButtonProps> {
  Icon: FC<IButtonIconProps>;
}

export const Button = ButtonContainer as IButton;
Button.Icon = ButtonIcon;
