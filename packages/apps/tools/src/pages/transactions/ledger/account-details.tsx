import type useAccountDetails from '@/hooks/use-account-details';
import React from 'react';

interface IAccountDetailsProps {
  query: ReturnType<typeof useAccountDetails>;
}

const AccountDetails = ({ query }: IAccountDetailsProps) => {
  if (!query.isFetched) {
    return 'Fill in the account name to fetch details about the account.';
  }

  if (query.isLoading) {
    return 'Fetching details…';
  }

  if (query.isError) {
    return `Oh noes! Something went wrong; ${query.error}`;
  }

  if (query.data.status === 'failure') {
    return `Oh noes! Something went wrong; ${
      (query.data.error as { message: string }).message
    }`;
  }

  const data = query.data.data as { guard: { pred: string; keys: string[] } };

  return (
    <div>
      <span>{data.guard.pred}</span>
      {data.guard.keys.map((key) => {
        return <span key={key}>{key}</span>;
      })}
    </div>
  );
};

export default AccountDetails;
