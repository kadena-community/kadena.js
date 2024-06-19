import { database } from "@/utils/firebase";
import { BuiltInPredicate, ChainId } from "@kadena/client";
import { OrderByDirection, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IPactDecimal, IPactInt } from "../../../../libs/types/dist/types";

export type Sale = {
  status: 'CREATED' | 'WITHDRAWN' | 'SOLD';
  requestKeys: Record<string, string>;
  saleId: string;
  tokenId: string;
  chainId: ChainId;
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

  startsAt?: number;
  endsAt?: number;
  startPrice: IPactDecimal;
  reservePrice?: IPactDecimal
  sellPrice?: IPactDecimal;
  priceInterval?: IPactInt;
  highestBid?: IPactDecimal
  highestBidId?: string
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

  const fetchData = useCallback(async () => {
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
  }, [props]);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
