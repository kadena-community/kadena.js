import { database } from '@/utils/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback, useState } from 'react';

export const useRemoveSale = (saleId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const deleteSale = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!saleId) throw new Error('Sale ID is required');

      await deleteDoc(doc(database, 'sales', saleId));
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  return { loading, error, deleteSale };
};
