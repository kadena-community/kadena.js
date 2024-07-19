import type { IEditNetwork } from '@/constants/network';
import { useNetwork } from '@/context/networks-context';
import { checkNetwork } from '@/utils/checkNetwork';
import { defaultNamingOfNetwork } from '@/utils/defaultNamingOfNetwork';
import { isDefaultNetwork } from '@/utils/isDefaultNetwork';
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
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import NetworkListItem from './network-listitem/network-listitem';
import { networkListClass } from './style.css';
import { getFormValues, validateNewNetwork } from './utils';

interface IProps {
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defineNewNetwork = (): IEditNetwork => {
  return {
    networkId: '',
    label: '',
    slug: '',
    chainwebUrl: '',
    graphUrl: '',
    wsGraphUrl: '',
    isNew: true,
  };
};

export const ConfigNetwork: FC<IProps> = ({ handleOpen }) => {
  const { networks, addNetwork, activeNetwork, removeNetwork } = useNetwork();
  const [formError, setFormError] = useState<(string | undefined)[]>();
  const refInputGraph = useRef<HTMLInputElement>(null);
  const [graphUrl, setGraphUrl] = useState('');

  const [network, setNetwork] = useState<IEditNetwork>(defineNewNetwork());

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const { label, networkId, slug, chainwebUrl, graphUrl } =
      getFormValues<any>(data);

    const newNetwork = {
      ...defineNewNetwork(),
      label,
      networkId,
      slug,
      graphUrl,
      chainwebUrl,
    };

    const errors = validateNewNetwork(networks, newNetwork);

    setFormError(errors);

    if (errors.length > 0) {
      console.warn('Errors adding network: ', errors.join('\n'));
      return;
    }

    addNetwork(newNetwork);
    handleOpen(false);
  };

  const handleChangeGraphUrl: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGraphUrl(e.target.value);
  };

  const validateNetwork = async () => {
    const value = refInputGraph?.current?.value ?? '';

    try {
      const result = await checkNetwork(value);

      const body = await result.json();

      if (result.status === 200) {
        setNetwork((v) => {
          if (v.isNew) {
            return {
              ...defaultNamingOfNetwork(v, body.data, networks),
              graphUrlIsValid: true,
              graphUrl: value,
            };
          }
          return { ...v, graphUrlIsValid: true };
        });
      } else {
        setNetwork((v) => ({ ...v, graphUrlIsValid: false }));
      }
    } catch (e) {
      setNetwork((v) => ({ ...v, graphUrlIsValid: false }));
    }
  };

  useEffect(() => {
    setGraphUrl(network.graphUrl);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    validateNetwork();
  }, [network.slug]);

  return (
    <Dialog
      isOpen={true}
      onOpenChange={(isOpen: boolean) => handleOpen(isOpen)}
    >
      {() => (
        <DialogContent>
          <Heading as="h3">Available networks</Heading>
          <Stack flexDirection="column" as="ul" className={networkListClass}>
            {networks.map((n) => {
              const innerNetwork =
                n.slug === network.slug
                  ? { ...n, graphUrlIsValid: network.graphUrlIsValid }
                  : { ...n };

              return (
                <>
                  <NetworkListItem
                    isDefaultNetwork={isDefaultNetwork(innerNetwork)}
                    isActive={
                      activeNetwork.networkId === innerNetwork.networkId &&
                      activeNetwork.label === innerNetwork.label
                    }
                    selectNetwork={() => {
                      if (network.slug !== innerNetwork.slug) {
                        setNetwork(innerNetwork);
                      }
                    }}
                    removeNetwork={() => removeNetwork(network)}
                    key={innerNetwork.label}
                    network={innerNetwork}
                  />
                  <Divider />
                </>
              );
            })}
            <Button
              onPress={() => {
                setNetwork(defineNewNetwork());
              }}
            >
              New network
            </Button>
          </Stack>

          <Heading as="h3">Create a new network</Heading>
          <Divider />
          <Form onSubmit={handleCreateNetwork}>
            <TextField
              ref={refInputGraph}
              label="GraphQL URL"
              name="graphUrl"
              value={graphUrl}
              variant={network.graphUrlIsValid ? 'positive' : 'default'}
              onChange={handleChangeGraphUrl}
              onBlur={(e) => {
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                validateNetwork();
              }}
              isRequired
              validate={() => {
                if (network.graphUrlIsValid === false) {
                  return 'This network is not reachable';
                }
              }}
              endAddon={
                <Button
                  isDisabled={!graphUrl}
                  variant={network.graphUrlIsValid ? 'primary' : 'transparent'}
                  onPress={validateNetwork}
                >
                  Validate
                </Button>
              }
            ></TextField>

            {network.graphUrlIsValid && (
              <>
                <TextField
                  label="Name"
                  name="label"
                  value={network?.label}
                  onChange={(e) => {
                    setNetwork((v) => ({ ...v, label: e.target.value }));
                  }}
                  autoFocus
                  isRequired
                ></TextField>
                <TextField
                  label="NetworkId"
                  value={network?.networkId}
                  onChange={(e) => {
                    setNetwork((v) => ({ ...v, networkId: e.target.value }));
                  }}
                  name="networkId"
                  isRequired
                ></TextField>
                <TextField
                  label="Slug"
                  name="slug"
                  value={network?.slug}
                  onChange={(e) => {
                    setNetwork((v) => ({ ...v, slug: e.target.value }));
                  }}
                  isRequired
                ></TextField>
              </>
            )}

            {formError && formError.length > 0 && (
              <Stack flexDirection="column">
                {(formError as string[]).map((e) => (
                  <Text key={e} color="emphasize">
                    {e}
                  </Text>
                ))}
              </Stack>
            )}

            <Stack flex={1} justifyContent="flex-end" marginBlock="md">
              {!isDefaultNetwork(network) && (
                <Button type="submit">
                  {!network.isNew ? 'Update network' : 'Create Network'}
                </Button>
              )}
            </Stack>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};
