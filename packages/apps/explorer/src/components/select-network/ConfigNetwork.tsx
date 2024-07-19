import type { IEditNetwork } from '@/constants/network';
import { useNetwork } from '@/context/networks-context';
import { checkNetwork } from '@/utils/checkNetwork';
import { defaultNamingOfNetwork } from '@/utils/defaultNamingOfNetwork';
import { isDefaultNetwork } from '@/utils/isDefaultNetwork';
import { MonoPermScanWifi } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  Form,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CardContentBlock, CardFooter } from '../CardPattern/CardPattern';
import { cardVisualClass, selectBoxClass } from './style.css';
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
  const { networks, addNetwork, removeNetwork } = useNetwork();
  const [formError, setFormError] = useState<(string | undefined)[]>();
  const refInputGraph = useRef<HTMLInputElement>(null);
  const [graphUrl, setGraphUrl] = useState('');

  const [network, setNetwork] = useState<IEditNetwork>(defineNewNetwork());

  const handleRemove = useCallback(() => {
    if (!confirm('Are you sure you want to remove this network')) return;
    removeNetwork(network);
  }, [network]);

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const { label, networkId, slug, graphUrl } = getFormValues<any>(data);

    const newNetwork = {
      ...defineNewNetwork(),
      label,
      networkId,
      slug,
      graphUrl,
      wsGraphUrl: graphUrl,
    };

    const errors = validateNewNetwork(networks, newNetwork);

    setFormError(errors);

    if (errors.length > 0) {
      console.warn('Errors adding network: ', errors.join('\n'));
      return;
    }
    delete newNetwork.isNew;
    delete newNetwork.graphUrlIsValid;

    addNetwork(newNetwork);
  };

  const handleChangeGraphUrl: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNetwork((v) => ({ ...v, graphUrlIsValid: undefined }));
    setGraphUrl(e.target.value);
  };

  const validateNetwork = async (url?: string) => {
    const value = url ? url : refInputGraph?.current?.value;
    if (!value) return;

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

  const handleSelectNetwork = (value: any): void => {
    if (value === 'new') {
      setNetwork(defineNewNetwork());
      return;
    }
    const network = networks.find((n) => n.slug === value);
    if (!network) return;
    setNetwork(network);
  };

  useEffect(() => {
    if (!network.slug) {
      setGraphUrl('');
      return;
    }
    setGraphUrl(network.graphUrl);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    validateNetwork(network.graphUrl);
  }, [network?.slug]);

  return (
    <Dialog
      isOpen={true}
      onOpenChange={(isOpen: boolean) => handleOpen(isOpen)}
    >
      {() => (
        <DialogContent>
          <Stack position="relative">
            <Select
              className={selectBoxClass}
              aria-label="Select network"
              selectedKey={network.slug}
              onSelectionChange={handleSelectNetwork}
            >
              {
                networks.map((n) => {
                  const innerNetwork =
                    n.slug === network.slug
                      ? { ...n, graphUrlIsValid: network.graphUrlIsValid }
                      : { ...n };

                  return (
                    <SelectItem
                      key={innerNetwork.slug}
                      textValue={innerNetwork.label}
                    >
                      {innerNetwork.label}
                    </SelectItem>
                  );
                }) as any
              }
              <SelectItem textValue="New network" key="new">
                New network
              </SelectItem>
            </Select>
          </Stack>

          <Form onSubmit={handleCreateNetwork}>
            <CardContentBlock
              title={!network.isNew ? 'Update network' : 'Create Network'}
              visual={<MonoPermScanWifi className={cardVisualClass} />}
            >
              <Stack gap="xl" flexDirection="column">
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
                      variant={
                        network.graphUrlIsValid === false
                          ? 'negative'
                          : network.graphUrlIsValid === true
                            ? 'primary'
                            : 'transparent'
                      }
                      onPress={() => validateNetwork()}
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
                        setNetwork((v) => ({
                          ...v,
                          networkId: e.target.value,
                        }));
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
              </Stack>
            </CardContentBlock>
            <CardFooter>
              {!isDefaultNetwork(network) && !network.isNew && (
                <Button onPress={handleRemove} variant="negative">
                  Remove
                </Button>
              )}
              <Stack flex={1} />

              {!isDefaultNetwork(network) && (
                <>
                  <Button
                    onPress={() => {
                      handleOpen(false);
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {!network.isNew ? 'Update network' : 'Create Network'}
                  </Button>
                </>
              )}
            </CardFooter>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};
