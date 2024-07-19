import type { INetwork } from '@/constants/network';
import { useNetwork } from '@/context/networks-context';
import { checkNetwork } from '@/utils/checkNetwork';
import { isDefaultNetwork } from '@/utils/isDefaultNetwork';
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
import type {
  ChangeEventHandler,
  EventHandler,
  FC,
  FocusEventHandler,
  FormEventHandler,
  MouseEventHandler,
} from 'react';
import React, { useRef, useState } from 'react';
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
  const refInputGraph = useRef<HTMLInputElement>(null);
  const [graphUrl, setGraphUrl] = useState('');
  const [graphUrlIsValid, setGraphUrlIsValid] = useState<boolean | null>(null);

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    let { label, networkId, slug, chainwebUrl, graphUrl } =
      getFormValues<any>(data);

    const newNetwork: INetwork = {
      networkId,
      label,
      slug,
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
  };

  const handleChangeGraphUrl: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGraphUrl(e.target.value);
  };

  const validateNetwork:
    | FormEventHandler<HTMLButtonElement>
    | FocusEventHandler<HTMLButtonElement> = async (e: any) => {
    e.preventDefault();

    const value = e.target.value;
    setGraphUrl(value);

    try {
      const result = await checkNetwork(value);
      await result.json();

      if (result.status === 200) {
        setGraphUrlIsValid(true);
      } else {
        setGraphUrlIsValid(false);
      }
    } catch (e) {
      setGraphUrlIsValid(false);
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
                  isDefaultNetwork={isDefaultNetwork(network)}
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
            <TextField label="Slug" name="slug" isRequired></TextField>
            <TextField
              ref={refInputGraph}
              label="GraphQL URL"
              name="graphUrl"
              onChange={handleChangeGraphUrl}
              onBlur={validateNetwork}
              isRequired
              validate={() => {
                if (graphUrlIsValid === false) {
                  return 'This network is not reachable';
                }
              }}
              endAddon={
                <Button
                  isDisabled={!graphUrl}
                  variant="transparent"
                  onPress={validateNetwork}
                >
                  Validate
                </Button>
              }
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
