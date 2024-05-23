import { database } from "@/utils/firebase";
import { OrderByDirection, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface EventData {
  id: string;
  block: number;
  chainId: number;
  event: string;
  occurredAt: number;
  parameters: any[];
  requestKey: string;
}

interface GetEventsProps {
  chainIds?: number[];
  events?: string[];
  limit?: number;
  sort?: {
    field: keyof EventData;
    direction?: OrderByDirection
  }[]
}

export const getEvents = (props?: GetEventsProps) => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {

        const constraints = [];

        if (props?.events) constraints.push(where("event", "in", props.events));

        if (props?.chainIds) constraints.push(where("chainId", "in", props.chainIds));

        if (props?.sort?.length) props.sort.forEach(sort =>
          constraints.push(orderBy(sort.field, sort.direction || "asc"))
        )

        if (props?.limit) constraints.push(limit(props.limit));

        const querySnapshot = await getDocs(
          query(
            collection(database, "events"),
            ...constraints
          )
        );
        const docs: EventData[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data(),
          } as EventData);
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
