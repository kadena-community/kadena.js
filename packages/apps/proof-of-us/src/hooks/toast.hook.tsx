'use client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';

interface IToastContext {
  toasts: IToast[];
  addToast: (toast: IToast) => void;
}

export const ToastContext = createContext<IToastContext>({
  toasts: [],
  addToast: (toast: IToast) => {},
});

export const useToasts = (): IToastContext => useContext(ToastContext);

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (toast: IToast): void => {
    setToasts((v) => [...v, toast]);
    setTimeout(() => {
      setToasts((v) => v?.filter((item) => item !== toast));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
};
