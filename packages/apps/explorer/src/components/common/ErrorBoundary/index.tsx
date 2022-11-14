import Error from 'components/common/Error';
import { AppProps } from 'next/app';
import React, { FC } from 'react';

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
