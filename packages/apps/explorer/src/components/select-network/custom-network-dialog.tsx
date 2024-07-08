import { useQueryContext } from '@/context/query-context';
import { MonoHub } from '@kadena/react-icons/system';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Heading,
  Stack,
  Text,
} from '@kadena/react-ui';
import { print } from 'graphql';
import React, { useState } from 'react';
import { buttonSizeClass } from '../navbar/styles.css';

export const GraphQLQueryDialog = (): JSX.Element => {
  const { networks } = useNetwork();

  if (!queries) queries = [];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={buttonSizeClass}
        startVisual={<MonoHub />}
        title="Show the GraphQL query used."
        variant="transparent"
        onPress={() => setIsOpen(true)}
      ></Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        {() => (
          <DialogContent>
            <Heading as="h2">What is @kadena/graph</Heading>

            <Text>
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
            </Text>
            <Text>
              Experiment with it here
              <ol>
                <li>
                  <Text as="span">
                    Mainnet:{' '}
                    <a href="https://graph.kadena.network/graphql">
                      graph.kadena.network
                    </a>
                  </Text>
                </li>
                <li>
                  Testnet:{' '}
                  <a href="https://graph.testnet.kadena.network/graphql">
                    graph.testnet.kadena.network
                  </a>
                </li>
              </ol>
            </Text>
            <Text>
              Documentation and more information can be found at{' '}
              <a href="https://docs.kadena.io/build/frontend/kadena-graph">
                docs.kadena.io
              </a>
            </Text>
            <Divider />
            <Heading as="h2">Queries ({queries.length})</Heading>
            {queries.map((query, index) => (
              <Stack key={index} flexDirection="column">
                <Text>Query #{index + 1}</Text>
                <Box marginBlockEnd="sm" />
                <pre>{print(query.query)}</pre>
                {query.variables && (
                  <>
                    <Box marginBlockEnd="sm" />
                    <Text>Variables</Text>
                    <Box marginBlockEnd="sm" />
                    <pre>{JSON.stringify(query.variables, null, 2)}</pre>
                  </>
                )}
                {!query.variables && (
                  <>
                    <Box marginBlock="sm">
                      <Text>No variables used for this query</Text>
                    </Box>
                  </>
                )}
                {index + 1 !== queries.length && <Divider />}
              </Stack>
            ))}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
