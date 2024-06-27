import { useQueryContext } from '@/context/query-context';
import { MonoHub } from '@kadena/react-icons/system';
import { Box, Button, Dialog, DialogContent, Divider } from '@kadena/react-ui';
import { print } from 'graphql';
import React, { useState } from 'react';

export const GraphQLQueryDialog = (): JSX.Element => {
  let { queries } = useQueryContext();

  if (!queries) queries = [];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        endVisual={<MonoHub />}
        title="Show the GraphQL query used."
        isCompact
        variant="transparent"
        onPress={() => setIsOpen(true)}
      >
        GraphQL
      </Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        {() => (
          <DialogContent>
            <h2>
              What is <code>@kadena/graph</code>
            </h2>
            <p>
              <a href="https://www.npmjs.com/package/@kadena/graph">
                <code>@kadena/graph</code>
              </a>{' '}
              is a GraphQL layer built on top of the Kadena blockchain. It
              facilitates efficient querying of blockchain data, including{' '}
              <strong>block details</strong>, <strong>transactions</strong>{' '}
              within blocks, <strong>outcomes</strong> of these transactions,{' '}
              <strong>mempool information</strong> and more. By leveraging a
              PostgreSQL database backend, fed by an ETL process known as
              chainweb-data, <code>@kadena/graph</code> provides a swift and
              structured way to access blockchain information.
            </p>
            <p>
              Experiment with it here
              <ol>
                <li>
                  Mainnet:{' '}
                  <a href="https://graph.kadena.network/graphql">
                    graph.kadena.network
                  </a>
                </li>
                <li>
                  Testnet:{' '}
                  <a href="https://graph.testnet.kadena.network/graphql">
                    graph.testnet.kadena.network
                  </a>
                </li>
              </ol>
            </p>
            <p>
              Documentation and more information can be found at{' '}
              <a href="https://docs.kadena.io/build/frontend/kadena-graph">
                docs.kadena.io
              </a>
            </p>
            <Divider />
            <h2>Queries ({queries.length})</h2>
            {queries.map((query, index) => (
              <div key={index}>
                <p>Query #{index + 1}</p>
                <Box marginBlockEnd="sm" />
                <pre>{print(query.query)}</pre>
                {query.variables && (
                  <>
                    <Box marginBlockEnd="sm" />
                    <p>Variables</p>
                    <Box marginBlockEnd="sm" />
                    <pre>{JSON.stringify(query.variables, null, 2)}</pre>
                  </>
                )}
                {!query.variables && (
                  <>
                    <Box marginBlockEnd="sm" />
                    <p>No variables used for this query</p>
                  </>
                )}
                {index + 1 !== queries.length && <Divider />}
              </div>
            ))}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
