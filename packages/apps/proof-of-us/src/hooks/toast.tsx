import type { IToastContext } from '@/components/ToastProvider/ToastProvider';
import { ToastContext } from '@/components/ToastProvider/ToastProvider';
import { useContext } from 'react';

export const useToasts = (): IToastContext => useContext(ToastContext);
