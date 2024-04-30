import { useEffect, useState } from 'react';

export const useTransaction = () => {
  const [transaction, setTransaction] = useState<string | null>();

  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.hash.replace(/^#/, '?'),
    );
    const tx = searchParams.get('transaction');
    setTransaction(tx);
  }, []);

  return {
    transaction,
  };
};
