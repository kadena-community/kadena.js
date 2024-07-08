import { useNetwork } from '@/context/networks-context';
import { useQueryContext } from '@/context/query-context';
import { MonoHub } from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Heading,
  Stack,
  Text,
  TextLink,
} from '@kadena/kode-ui';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import React, { useState } from 'react';
import { buttonSizeClass } from '../navbar/styles.css';
import { code } from './styles.css';

export const GraphQLQueryDialog = (): JSX.Element => {
  let { queries } = useQueryContext();
  const { activeNetwork } = useNetwork();

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
            <Heading as="h3">What is @kadena/graph</Heading>
            <Box marginBlockEnd="sm" />

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

            <Heading as="h4">Queries used on this page</Heading>
            <Box marginBlockEnd="sm" />

            <Text>Click the link to customize the query and try it out</Text>

            {queries.map((query, index) => (
              <>
                <Stack key={index} flexDirection="column">
                  <Box marginBlockEnd="sm" />

                  <Text>
                    <TextLink
                      key={index}
                      target="_blank"
                      href={createEmbedQueryUrl(query, activeNetwork.graphUrl)}
                      withIcon={true}
                    >
                      {`Query ${index + 1}: ${getQueryTitle(print(query.query)) || ''}`}
                    </TextLink>
                  </Text>
                  <pre className={code}>{print(query.query)}</pre>
                  {query.variables && (
                    <>
                      <Box marginBlockEnd="sm" />
                      <Text>Variables</Text>
                      <Box marginBlockEnd="sm" />
                      <pre className={code}>
                        {JSON.stringify(query.variables, null, 2)}
                      </pre>
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
              </>
            ))}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

const EMBED_URL =
  'https://embed.graphql.com/embed?endpointURL=%22eeeee%22&query=%22qqqqq%22&variables=%22vvvvv%22&response=%22rrrr%22&history=true&prettify=true&docs=true';

function createEmbedQueryUrl(
  {
    query,
    variables,
  }: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
  },
  endpoint: string,
): string {
  return EMBED_URL.replace('eeeee', encodeURIComponent(endpoint))
    .replace('qqqqq', encodeURIComponent(print(query).split('\n').join('\\n')))
    .replace(
      'vvvvv',
      encodeURIComponent(
        JSON.stringify(JSON.stringify(variables || {}))
          .slice(1)
          .slice(0, -1),
      ),
    )
    .replace(
      'rrrr',
      'Click Play!\\nNote: subscriptions are not supported in this view',
    );
}

function getQueryTitle(query: string): string | undefined {
  return query.match(/((query|subscription).*?){/)?.[1];
}
