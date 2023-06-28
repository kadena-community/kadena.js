import { Button as ButtonContainer, IButtonProps } from './Button';
import { ButtonIcon, IButtonIconProps } from './ButtonIcon';

import { FC } from 'react';

export { IButtonProps };
interface IButton {
  Root: FC<IButtonProps>;
  Icon: FC<IButtonIconProps>;
}

export const Button: IButton = {
  Root: ButtonContainer,
  Icon: ButtonIcon,
};
