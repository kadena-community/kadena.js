import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC, ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import { useObjectRef } from 'react-aria';
import { Button } from '../Button';
import { actionButtonRecipe } from './Notification.css';

type Variants = NonNullable<RecipeVariants<typeof actionButtonRecipe>>;

export interface INotificationButtonProps extends Variants {
  onClick?: () => void;
  children: React.ReactElement | string;
  icon: React.ReactElement;
  isDisabled?: boolean;
}
const NotificationButton: FC<INotificationButtonProps> = forwardRef(
  (
    { intent, children, icon, ...props },
    forwardedRef: ForwardedRef<HTMLButtonElement>,
  ) => {
    const ref = useObjectRef(forwardedRef);

    return (
      <Button
        ref={ref}
        variant="transparent"
        className={actionButtonRecipe({ intent })}
        endVisual={icon}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

NotificationButton.displayName = 'NotificationButton';
export { NotificationButton };
