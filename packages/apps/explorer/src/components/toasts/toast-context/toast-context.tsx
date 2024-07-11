import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useState } from 'react';

interface IToast {
  type: 'success' | 'info' | 'error';
  label: string;
  body: string;
}

interface IToastContext {
  toasts: IToast[];
  addToast: (toast: IToast) => void;
}

export const ToastContext = createContext<IToastContext>({
  toasts: [],
  addToast: () => {},
});

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const addToast = (toast: IToast) => {};
  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
};
