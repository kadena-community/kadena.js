import { useRouter } from '@/hooks/router';
import type { DocumentNode } from 'graphql';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IQueryContext {
  queries: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
  }[];
  setQueries: (queries: IQueryContext['queries']) => void;
}

const QueryContext = createContext<IQueryContext>({
  queries: [],
  setQueries: () => {},
});

const useQueryContext = (): IQueryContext => {
  const context = useContext(QueryContext);

  if (context === undefined) {
    throw new Error('Please use QueryContextProvider in parent component');
  }

  return context;
};

const QueryContextProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const [queries, setQueries] = useState<IQueryContext['queries']>([]);
  const router = useRouter();
  const handleSetQueries = (queries: IQueryContext['queries']) => {
    setQueries((v) => {
      // if the query already exists, do not add it
      const uniqueQueries = queries.filter((query) => {
        return !v.some(
          (innerQuery) => JSON.stringify(innerQuery) === JSON.stringify(query),
        );
      });

      return [...v, ...uniqueQueries];
    });
  };

  const startHandler = () => {
    setQueries([]);
  };
  useEffect(() => {
    router.events.on('routeChangeStart', startHandler);

    return () => {
      router.events.off('routeChangeStart', startHandler);
    };
  }, []);

  return (
    <QueryContext.Provider value={{ queries, setQueries: handleSetQueries }}>
      {props.children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider, useQueryContext };
