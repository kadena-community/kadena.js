import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC } from 'react';
import React from 'react';
import { actionButtonIconClass, actionButtonRecipe } from './Notification.css';

type Variants = NonNullable<RecipeVariants<typeof actionButtonRecipe>>;

export interface INotificationButtonProps extends Variants {
  onClick?: () => void;
  children: React.ReactNode;
  icon: React.ReactElement;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  intent,
  onClick,
  children,
  icon,
}) => {
  return (
    <button onClick={onClick} className={actionButtonRecipe({ intent })}>
      {children}
      <span className={actionButtonIconClass}>{icon}</span>
    </button>
  );
};
