import { MonoClose, MonoInfo } from '@kadena/react-icons/system';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  closeButtonClass,
  contentClassRecipie,
  iconClass,
  notificationRecipe,
} from './Notification.css';

type Variants = NonNullable<RecipeVariants<typeof notificationRecipe>>;
type ContentTypeVariants = NonNullable<
  RecipeVariants<typeof contentClassRecipie>
>;
export interface INotificationProps extends Variants, ContentTypeVariants {
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
  type,
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

      <div className={contentClassRecipie({ type })}>{children}</div>

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
