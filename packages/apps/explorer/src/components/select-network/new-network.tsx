import { useNetworkInfoQuery } from '@/__generated__/sdk';
import type { INetwork } from '@/context/networks-context';
import { useNetwork } from '@/context/networks-context';
import type { ApolloError, NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Form,
  Heading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { createClient } from 'graphql-ws';
import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';
import { getFormValues, validateNewNetwork } from './utils';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const getApolloClient = (network: INetwork) => {
  const httpLink = new YogaLink({
    endpoint: network?.graphUrl,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: network!.wsGraphUrl,
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink, // Use WebSocket link for subscriptions
    httpLink, // Use HTTP link for queries and mutations
  );

  console.log(222, { splitLink });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return client;
};

interface IProps {
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createNetwork: FormEventHandler<HTMLFormElement>;
}

const NewNetwork: FC<IProps> = ({ handleOpen, createNetwork }) => {
  const { networks } = useNetwork();
  const [formError, setFormError] = useState<(string | undefined)[]>();
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined);

  let loading: boolean = false;
  let data: any;
  let error: ApolloError | undefined;

  //const apolloc = useApolloClient(client);

  try {
    const result = useNetworkInfoQuery({
      client: client,
      skip: !client,
    });
    console.log({ result });

    loading = result.loading;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data = result.data;
    error = result.error;
  } catch (e) {
    console.error(333, e);
  }

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    let { label, networkId, chainwebUrl, graphUrl } =
      getFormValues<INetwork>(data);

    const errors = validateNewNetwork(networks, {
      label,
      networkId,
      chainwebUrl,
      graphUrl,
    });

    console.log({ errors });
    setFormError(errors);

    // if (errors.length > 0) {
    //   console.warn('Errors adding network: ', errors.join('\n'));
    //   return;
    // }

    if (label.length === 0) {
      label = networkId;
    }

    setClient(
      getApolloClient({
        networkId: 'devnet',
        label: 'devnet',
        chainwebUrl: 'api.testnet.chainweb.com',
        graphUrl: 'https://localhost:4000/graphql',
        wsGraphUrl: 'https://localhost:4000/graphql',
        explorerUrl: 'https://explorer.testnet.kadena.io/',
      }),
    );

    // addNetwork({
    //   networkId,
    //   label,
    //   chainwebUrl,
    //   graphUrl,
    //   wsGraphUrl: graphUrl,
    // });

    //createNetwork(e);
  };

  return (
    <Dialog
      isOpen={true}
      onOpenChange={(isOpen: boolean) => handleOpen(isOpen)}
    >
      {() => (
        <DialogContent>
          <Heading as="h3">Create a new network</Heading>
          <Divider />
          <Form onSubmit={handleCreateNetwork}>
            <TextField
              label="Name"
              name="label"
              autoFocus
              isRequired
            ></TextField>
            <TextField
              label="Identifier"
              name="networkId"
              isRequired
            ></TextField>
            <TextField
              label="GraphQL URL"
              name="graphUrl"
              isRequired
            ></TextField>
            {/* <TextField label="Chainweb URL" name="chainwebUrl"></TextField> */}

            {formError && formError.length > 0 && (
              <Stack flexDirection="column">
                {(formError as string[]).map((e) => (
                  <Text key={e} color="emphasize">
                    {e}
                  </Text>
                ))}
              </Stack>
            )}

            {loading && <Stack>loading</Stack>}
            {error && <Stack>the graphURL is not a correct graph</Stack>}

            <Stack flex={1} justifyContent="flex-end" marginBlock="md">
              <Button type="submit">Create Network</Button>
            </Stack>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default NewNetwork;
