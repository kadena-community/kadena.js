'use client';
import { useToasts } from '@/hooks/toast';
import type { FC } from 'react';

export const Toasts: FC = () => {
  const { toasts } = useToasts();

  return (
    <section>
      <ul>
        {toasts.map((toast, idx) => (
          <li key={idx}>{toast.message}</li>
        ))}
      </ul>
    </section>
  );
};
