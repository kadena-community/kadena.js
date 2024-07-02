import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { isEmailValid } from '@/utils/isEmailValid';
import type { IButtonProps } from '@kadena/kode-ui';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';

interface IReturn {
  hasError: boolean;
  message?: string;
  handleFormState: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubscribe: IButtonProps['onClick'];
  canSubmit: boolean;
  hasSuccess: boolean;
  isLoading: boolean;
}

export const useSubscribe = (): IReturn => {
  const [email, setEmail] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const canSubmit = Boolean(email) && !hasError;
  const hasSuccess = Boolean(message) && !hasError;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSubscribe = async (
    event: MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
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
        setIsLoading(false);
      }
      setMessage(body.message);
    } catch (e) {
      setHasError(true);
      setIsLoading(false);
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
    isLoading,
  };
};
