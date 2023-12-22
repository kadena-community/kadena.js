import type { ApolloError } from '@apollo/client';
import React from 'react';
import { centerBlockStyle } from '../common/center-block/styles.css';
import Loader from '../common/loader/loader';
import { ErrorBox } from '../error-box/error-box';

interface ILoaderAndErrorProps {
  loading: boolean;
  loaderText?: string;
  error: ApolloError | undefined;
}

const LoaderAndError: React.FC<ILoaderAndErrorProps> = (props) => {
  const { loading, loaderText, error } = props;

  return (
    <div className={centerBlockStyle}>
      {loading && (
        <>
          <Loader />
          <span>{loaderText ? loaderText : 'Loading...'}</span>
        </>
      )}
      {error && <ErrorBox error={error} />}
    </div>
  );
};

export default LoaderAndError;
