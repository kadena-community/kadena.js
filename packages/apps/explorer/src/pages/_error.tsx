'use client';
import Error from '@/components/ErrorBoundary/Error';

import * as Sentry from '@sentry/nextjs';
import React from 'react';

const GlobalError = (props: any) => {
  return (
    <>
      <Error {...props} />
    </>
  );
};

export default Sentry.withErrorBoundary(GlobalError, {
  fallback: (props) => <GlobalError {...props} />,
  showDialog: true,
});
