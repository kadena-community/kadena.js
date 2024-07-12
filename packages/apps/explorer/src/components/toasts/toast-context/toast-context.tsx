import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { isNewClass, toastWrapperClass } from '../style.css';
import Toast from '../toast/toast';

export interface IToast {
  id: string;
  type: 'warning' | 'info' | 'positive' | 'negative';
  label: string;
  body: string;
}

interface IToastContext {
  toasts: IToast[];
  addToast: (toast: Omit<IToast, 'id'>) => void;
}

export const ToastContext = createContext<IToastContext>({
  toasts: [],
  addToast: () => {},
});

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [isNew, setIsNew] = useState(false);
  const addToast = (toast: Omit<IToast, 'id'>) => {
    const id = Math.random().toString(16).slice(2);
    console.log(id);
    setToasts((v) => [...v, { ...toast, id }]);
    setIsNew(true);

    setTimeout(() => {
      setIsNew(false);
    }, 1000);
  };

  const removeToast = (toast: IToast) => {
    setToasts((v) => v.filter((v) => v.id !== toast.id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
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
