import type { DocumentNode } from 'graphql';
import React, { createContext, useContext, useState } from 'react';

interface IQueryContext {
  queries:
    | {
        query: DocumentNode;
        variables?: Record<string, unknown>;
      }[]
    | null;
  setQueries: (queries: IQueryContext['queries']) => void;
}

const QueryContext = createContext<IQueryContext>({
  queries: null,
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
  const [queries, setQueries] = useState<IQueryContext['queries']>(null);

  return (
    <QueryContext.Provider value={{ queries, setQueries }}>
      {props.children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider, useQueryContext };
