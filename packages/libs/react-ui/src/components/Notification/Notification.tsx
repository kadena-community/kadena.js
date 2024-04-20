import { MonoClose, MonoInfo } from '@kadena/react-icons/system';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  closeButtonClass,
  contentClass,
  iconClass,
  notificationRecipe,
} from './Notification.css';

type Variants = NonNullable<RecipeVariants<typeof notificationRecipe>>;
export interface INotificationProps extends Variants {
  children?: React.ReactNode;
  isDismissable?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  role: 'alert' | 'status' | 'none';
}

export const Notification: FC<INotificationProps> = ({
  children,
  isDismissable = false,
  intent,
  displayStyle,
  onDismiss,
  icon,
  role,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={notificationRecipe({
        intent,
        displayStyle,
      })}
      role={role}
    >
      <span className={iconClass}>{icon ? icon : <MonoInfo />}</span>

      <div className={contentClass}>{children}</div>

      {isDismissable && (
        <button
          className={closeButtonClass}
          onClick={() => {
            setIsDismissed(true);
            onDismiss?.();
          }}
          aria-label="Close Notification"
        >
          <MonoClose />
        </button>
      )}
    </div>
  );
};
