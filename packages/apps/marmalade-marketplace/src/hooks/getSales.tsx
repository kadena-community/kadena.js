import { database } from "@/utils/firebase";
import { BuiltInPredicate } from "@kadena/client";
import { OrderByDirection, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export type Sale = {
  status: 'CREATED' | 'WITHDRAWN' | 'SOLD';
  requestKeys: Record<string, string>;
  saleId: string;
  tokenId: string;
  chainId: number;
  block: number;
  amount: number;
  timeoutAt: number;
  seller: {
    account: string;
    guard?: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  buyer?: {
    account: string;
    guard?: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  saleType?: string;
  escrow?: string;
  price?: number;
  startPrice?: number;
};

interface GetSalesProps {
  chainIds?: number[];
  block?: number;
  status?: Sale['status'];
  saleType?: Sale['saleType'];
  limit?: number;
  sort?: {
    field: keyof Sale;
    direction?: OrderByDirection
  }[]
}

export const getSales = (props?: GetSalesProps) => {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {

        const constraints = [];

        if (props?.chainIds) constraints.push(where("chainId", "in", props.chainIds));

        if (props?.block) constraints.push(where("block", "==", props.block));

        if (props?.status) constraints.push(where("status", "==", props.status));

        if (props?.saleType) constraints.push(where("saleType", "==", props.saleType));

        if (props?.sort?.length) props.sort.forEach(sort =>
          constraints.push(orderBy(sort.field, sort.direction || "asc"))
        )

        if (props?.limit) constraints.push(limit(props.limit));

        const querySnapshot = await getDocs(
          query(
            collection(database, "sales"),
            ...constraints
          )
        );
        const docs: Sale[] = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data() as Sale);
        });
        setData(docs);
      } catch (err) {
        console.log(err)
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
