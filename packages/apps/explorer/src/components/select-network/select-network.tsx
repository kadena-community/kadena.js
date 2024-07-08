import type { INetwork } from '@/context/networks-context';
import { useNetwork } from '@/context/networks-context';
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Form,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';

import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';

const SelectNetwork: FC = () => {
  const { networks, addNetwork, activeNetwork, setActiveNetwork } =
    useNetwork();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<(string | undefined)[]>();

  const handleSelectNetwork = (value: any): void => {
    if (value === 'new') {
      setIsOpen(true);
      return;
    }

    setActiveNetwork(value);
  };

  if (!networks) return null;

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = (e): void => {
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
    setFormError(errors);

    if (errors.length > 0) {
      console.warn('Errors adding network: ', errors.join('\n'));
      return;
    }

    // set label to identifier if empty
    if (label.length === 0) {
      label = networkId;
    }

    addNetwork({
      networkId,
      label,
      chainwebUrl,
      graphUrl,
      wsGraphUrl: graphUrl,
    });

    setIsOpen(false);
  };

  return (
    <>
      <Select
        size="lg"
        aria-label="Select network"
        selectedKey={activeNetwork!.networkId}
        fontType="code"
        onSelectionChange={handleSelectNetwork}
      >
        {
          networks.map((network) => (
            <SelectItem key={network.networkId} textValue={network.label}>
              {network.label}
            </SelectItem>
          )) as any
        }
        <SelectItem key="new">New Network...</SelectItem>
      </Select>
      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
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
                description="The label to show in the networks menu"
              ></TextField>
              <TextField
                label="Identifier"
                name="networkId"
                description="The identifier used in transactions"
              ></TextField>
              <TextField label="GraphQL URL" name="graphUrl"></TextField>
              {/* <TextField label="Chainweb URL" name="chainwebUrl"></TextField> */}

              {formError && formError.length > 0 && (
                <Stack>
                  {(formError as string[]).map((e) => (
                    <Text key={e} color="emphasize">
                      {e}
                    </Text>
                  ))}
                </Stack>
              )}
              <Button type="submit">Create</Button>
            </Form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SelectNetwork;

function getFormValues<T extends Record<string, unknown>>(data: FormData): T {
  const values: Record<string, unknown> = {};
  data.forEach((value, key) => {
    values[key] = value;
  });
  return values as T;
}

function validateNewNetwork(
  networks: INetwork[],
  newNetwork: {
    label: string;
    networkId: string;
    chainwebUrl: string | undefined;
    graphUrl: string;
  },
): string[] {
  const errors = [];

  if (networks.some((network) => network.networkId === newNetwork.networkId)) {
    errors.push('network already exists');
  }

  errors.push(
    ...(Object.entries(newNetwork)
      .map(([key, value]) => {
        switch (key) {
          case 'networkId':
          case 'graphUrl':
            return value === undefined || value.length <= 0
              ? `'${key}' is required`
              : undefined;
          case 'label':
          case 'chainwebUrl':
          default:
            return undefined;
        }
      })
      .filter(Boolean) as string[]),
  );

  return errors;
}
