import { COOKIE_CONSENT_KEY } from '@/components/CookieConsent/CookieConsent';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import type { INetwork } from '@/constants/network';
import { useNetwork } from '@/context/networksContext';
import type { DocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

interface IErrorInfo {
  errorLabel: string;
}

export const sendSentry = (errorInfo: IErrorInfo, network: INetwork) => {
  const sentryContent = {
    mechanism: {
      handled: true,
      data: { message: errorInfo.errorLabel },
      type: 'graphQL-error',
    },
    captureContext: {
      level: 'error' as const,
      extra: {
        network: network,
      },
    },
  };

  if (localStorage.getItem(COOKIE_CONSENT_KEY) === 'true') {
    Sentry.captureException(errorInfo.errorLabel, sentryContent);
  }
};

export const useGraphQuery = (
  query: DocumentNode,
  variables: Record<string, any>,
  errorInfo: IErrorInfo,
) => {
  const { activeNetwork } = useNetwork();
  const { addToast } = useToast();
  const { data, error, loading } = useQuery(query, variables);

  useEffect(() => {
    if (error && !loading) {
      addToast({
        type: 'negative',
        label: errorInfo.errorLabel,
      });

      sendSentry(errorInfo, activeNetwork);
    }
  }, [error, loading]);

  return { data, error, loading };
};
