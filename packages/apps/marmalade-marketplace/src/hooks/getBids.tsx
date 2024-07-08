import { database } from "@/utils/firebase";
import { BuiltInPredicate, ChainId } from "@kadena/client";
import { OrderByDirection, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export type Bid = {
  bid: number;
  bidId: string;
  bidder: {
    account: string;
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  block: number;
  chainId: ChainId;
  requestKey: string;
  tokenId: string
};

interface GetBidsProps {
  chainIds?: number[];
  block?: number;
  limit?: number;
  tokenId?: string;
  bidId?: string;
  sort?: {
    field: keyof Bid;
    direction?: OrderByDirection
  }[]
}

export const getBids = (props?: GetBidsProps) => {
  const [data, setData] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const constraints = [];

      if (props?.chainIds) constraints.push(where("chainId", "in", props.chainIds));

      if (props?.block) constraints.push(where("block", "==", props.block));

      if (props?.tokenId) constraints.push(where("tokenId", "==", props.tokenId));

      if (props?.bidId) constraints.push(where("bidId", "==", props.bidId));

      if (props?.sort?.length) props.sort.forEach(sort =>
        constraints.push(orderBy(sort.field, sort.direction || "asc"))
      )

      if (props?.limit) constraints.push(limit(props.limit));

      const querySnapshot = await getDocs(
        query(
          collection(database, "bids"),
          ...constraints
        )
      );
      const docs: Bid[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as Bid);
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
