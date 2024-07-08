import { database } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Sale } from "./getSales";

export const getSale = (saleId: string) => {
  const [data, setData] = useState<Sale | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!saleId) throw new Error('Sale ID is required');

      const saleDoc = await getDoc(
        doc(database, 'sales', saleId)
      );

      if (saleDoc.exists()) {
        setData(saleDoc.data() as Sale)
      } else {
        setError(new Error('Sale not found'));
      }

    } catch (err) {
      console.log(err)
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    fetchData();
  }, [saleId]);

  return { data, loading, error, refetch: fetchData };
};
