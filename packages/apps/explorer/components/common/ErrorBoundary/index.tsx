import React, { FC } from 'react';
import { AppProps } from 'next/app';
import Error from 'components/common/Error';

const ErrorBoundary: FC<{ children: JSX.Element } & AppProps> = ({
  children,
  ...pageProps
}) => {
  if ((pageProps as any).hasError) {
    return <Error>500 - Server-side error occurred</Error>;
  }

  return children;
};

export default ErrorBoundary;
