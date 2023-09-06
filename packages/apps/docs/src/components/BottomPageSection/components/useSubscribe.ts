import { isEmailValid } from '@/utils';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';

interface IReturn {
  hasError: boolean;
  message?: string;
  handleFormState: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubscribe: (e: MouseEvent<HTMLButtonElement, SubmitEvent>) => void;
  canSubmit: boolean;
  hasSuccess: boolean;
}

export const useSubscribe = (): IReturn => {
  const [email, setEmail] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const canSubmit = Boolean(email) && !hasError;
  const hasSuccess = Boolean(message) && !hasError;

  const handleSubscribe = async (
    event: MouseEvent<HTMLButtonElement, SubmitEvent>,
  ): Promise<void> => {
    event.preventDefault();

    analyticsEvent(EVENT_NAMES['click:subscribe']);

    try {
      if (!canSubmit) return;
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const body = await res.json();

      if (body.status > 200) {
        setHasError(true);
      }
      setMessage(body.message);
    } catch (e) {
      setHasError(true);
      setMessage('There was a problem, please try again later');
    }
  };

  const handleFormState = (event: ChangeEvent<HTMLInputElement>): void => {
    const { currentTarget } = event;
    const email = currentTarget.value;
    setHasError(false);
    setMessage(undefined);

    if (!isEmailValid(email)) {
      setHasError(true);
    }
    setEmail(email);
  };

  return {
    hasError,
    message,
    handleFormState,
    handleSubscribe,
    canSubmit,
    hasSuccess,
  };
};
