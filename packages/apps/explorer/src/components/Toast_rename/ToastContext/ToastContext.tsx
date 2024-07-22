import { MonoAutorenew } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../Toast_rename/Toast_rename';
import { isNewClass, toastWrapperClass } from '../style.css';

export interface IToast {
  id: string;
  type: 'warning' | 'info' | 'positive' | 'negative';
  label: string;
  body: string;
  permanent?: boolean;
  action?: () => void;
  actionIcon?: ReactElement;
  actionLabel?: string;
  onlyOne?: boolean; //if this value is set, there can only be 1 error with this value. all next ones will be ignored
}

export type INetworkToast = Pick<IToast, 'body'>;

interface IToastContext {
  toasts: IToast[];
  addToast: (toast: Omit<IToast, 'id'>) => void;
  addNetworkFailToast: (toast: INetworkToast) => void;
}

export const ToastContext = createContext<IToastContext>({
  toasts: [],
  addToast: () => {},
  addNetworkFailToast: () => {},
});

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [isNew, setIsNew] = useState(false);

  const createId = (): string => Math.random().toString(16).slice(2);
  const addToast = (toast: Omit<IToast, 'id'>) => {
    // first check if there already is a toast with this specific onlyOneOfType that is not null
    if (toast.onlyOne) {
      setToasts([{ ...toast, id: createId() }]);
      return;
    }

    setToasts((prevToasts) => {
      //if there is a toast that has onLyOne to true, do not add the toast
      if (prevToasts.find((t) => t.onlyOne)) return [...prevToasts];

      return [...prevToasts, { ...toast, id: createId() }];
    });
    setIsNew(true);

    setTimeout(() => {
      setIsNew(false);
    }, 1000);
  };

  const addNetworkFailToast = (toast: INetworkToast) => {
    const newToast: Omit<IToast, 'id'> = {
      ...toast,
      onlyOne: true,
      type: 'negative',
      label: 'Network not found',
      permanent: true,
      actionLabel: 'Retry',
      actionIcon: <MonoAutorenew />,
      action: () => {
        window.location.reload();
      },
    };

    //there can only be 1 error like this.
    addToast(newToast);
  };

  const removeToast = (toast: IToast) => {
    setToasts((v) => v.filter((v) => v.id !== toast.id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, addNetworkFailToast }}>
      {children}
      {toasts.length > 0 && (
        <Stack
          flexDirection="column"
          className={classNames(toastWrapperClass, { [isNewClass]: isNew })}
          gap="md"
        >
          {isNew}
          {toasts.map((toast, idx) => (
            <Toast
              idx={toasts.length - idx}
              key={toast.id}
              toast={toast}
              removeToast={removeToast}
            />
          ))}
        </Stack>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): IToastContext => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('Please use toastProvider in parent component');
  }

  return context;
};
