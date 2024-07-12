import type { INetwork } from '@/context/networks-context';
import { useNetwork } from '@/context/networks-context';
import { MonoCheck, MonoClose } from '@kadena/kode-icons/system';
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
import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';
import NetworkListItem from './network-listitem/network-listitem';
import { networkListClass } from './style.css';
import { getFormValues, validateNewNetwork } from './utils';

interface IProps {
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createNetwork: FormEventHandler<HTMLFormElement>;
  selectNetwork: (value: any) => void;
  removeNetwork: (network: INetwork) => void;
}

const NewNetwork: FC<IProps> = ({
  handleOpen,
  createNetwork,
  selectNetwork,
  removeNetwork,
}) => {
  const { networks, addNetwork, activeNetwork } = useNetwork();
  const [formError, setFormError] = useState<(string | undefined)[]>();
  const [checkStatus, setCheckStatus] = useState<number>(0);

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    let { label, networkId, chainwebUrl, graphUrl } =
      getFormValues<INetwork>(data);

    const newNetwork: INetwork = {
      networkId,
      label,
      chainwebUrl,
      graphUrl,
      wsGraphUrl: graphUrl,
    };

    const errors = validateNewNetwork(networks, newNetwork);

    setFormError(errors);

    if (errors.length > 0) {
      console.warn('Errors adding network: ', errors.join('\n'));
      return;
    }

    if (label.length === 0) {
      label = networkId;
    }

    try {
      const result = await fetch(graphUrl, {
        method: 'POST',
        headers: {
          accept:
            'application/graphql-response+json, application/json, multipart/mixed',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          pragma: 'no-cache',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        body: JSON.stringify({
          query: `query networkInfo {
            networkInfo {
              totalDifficulty
            }
          }`,
          variables: {},
          operationName: 'networkInfo',
          extensions: {},
        }),
      });
      setCheckStatus(result.status);

      await result.json();

      if (result.status === 200) {
        addNetwork(newNetwork);
        createNetwork(e);
      }
    } catch (e) {
      setCheckStatus(500);
    }
  };

  return (
    <Dialog
      isOpen={true}
      onOpenChange={(isOpen: boolean) => handleOpen(isOpen)}
    >
      {() => (
        <DialogContent>
          <Heading as="h3">Available networks</Heading>
          <Stack flexDirection="column" as="ul" className={networkListClass}>
            {networks.map((network) => (
              <>
                <NetworkListItem
                  isActive={
                    activeNetwork.networkId === network.networkId &&
                    activeNetwork.label === network.label
                  }
                  selectNetwork={selectNetwork}
                  removeNetwork={removeNetwork}
                  key={network.label}
                  network={network}
                />
                <Divider />
              </>
            ))}
          </Stack>

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

            {formError && formError.length > 0 && (
              <Stack flexDirection="column">
                {(formError as string[]).map((e) => (
                  <Text key={e} color="emphasize">
                    {e}
                  </Text>
                ))}
              </Stack>
            )}

            {checkStatus === 200 && (
              <Stack>
                <MonoCheck />
              </Stack>
            )}
            {checkStatus > 200 && (
              <Stack>
                <MonoClose /> There is an issue with the graph URL
              </Stack>
            )}

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
