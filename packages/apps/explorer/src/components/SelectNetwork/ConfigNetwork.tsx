import type { IEditNetwork, INetwork } from '@/constants/network';
import { useNetwork } from '@/context/networksContext';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { checkNetwork } from '@/utils/checkNetwork';
import { defaultNamingOfNetwork } from '@/utils/defaultNamingOfNetwork';
import { isDefaultNetwork } from '@/utils/isDefaultNetwork';
import { MonoPermScanWifi } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  Form,
  Notification,
  NotificationHeading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CardContentBlock, CardFooter } from '../CardPattern/CardPattern';
import { Headers } from './Headers';
import { cardVisualClass } from './style.css';
import { defineNewNetwork, getFormValues, validateNewNetwork } from './utils';

interface IProps {
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfigNetwork: FC<IProps> = ({ handleOpen }) => {
  const { networks, addNetwork, removeNetwork } = useNetwork();
  const [formError, setFormError] = useState<(string | undefined)[]>();
  const refInputGraph = useRef<HTMLInputElement>(null);
  const refInputHeaders = useRef<HTMLDivElement>(null);
  const [graphUrl, setGraphUrl] = useState('');

  const [network, setNetwork] = useState<IEditNetwork>(defineNewNetwork());

  const handleRemove = useCallback(() => {
    if (!confirm('Are you sure you want to remove this network')) return;

    removeNetwork(network);
  }, [network]);

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const { label, networkId, slug, graphUrl, isNew } =
      getFormValues<any>(data);

    const newNetwork =
      isNew === 'true'
        ? {
            ...defineNewNetwork(),
            label,
            networkId,
            slug,
            graphUrl,
            wsGraphUrl: graphUrl,
          }
        : {
            ...network,
            label,
            networkId,
            graphUrl,
            wsGraphUrl: graphUrl,
            isNew: false,
          };

    const errors = validateNewNetwork(networks, newNetwork);
    setFormError(errors);
    if (errors.length > 0) {
      console.warn('Errors adding network: ', errors.join('\n'));
      return;
    }
    delete newNetwork.isNew;
    delete newNetwork.graphUrlIsValid;

    analyticsEvent(EVENT_NAMES['click:add_network'], {
      network: network.graphUrl,
    });

    addNetwork(newNetwork);
    handleOpen(false);
  };

  const handleChangeGraphUrl: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNetwork((v) => ({ ...v, graphUrlIsValid: undefined }));
    setGraphUrl(e.target.value);
  };

  const validateNetwork = async (url?: string) => {
    const value = url ? url : refInputGraph?.current?.value;
    let headers: INetwork['headers'] = {};
    if (!value) return;

    if (refInputHeaders.current) {
      console.log(11111);

      const keys =
        refInputHeaders.current.querySelectorAll<HTMLInputElement>(
          `input[name="key"]`,
        );
      const values =
        refInputHeaders.current.querySelectorAll<HTMLInputElement>(
          `input[name="value"]`,
        );

      const keyValues = Array.from(keys).map((input) => input.value);
      const valueValues = Array.from(values).map((input) => input.value);

      headers = keyValues.reduce((acc, val, idx) => {
        return { ...acc, [val]: valueValues[idx] };
      }, {});

      console.log({ keyValues, valueValues });
    }

    analyticsEvent(EVENT_NAMES['click:validate_network'], {
      network: value,
    });

    try {
      const result = await checkNetwork(value, headers);
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
    if (network.isNew) return;
    setGraphUrl(network?.graphUrl);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    validateNetwork(network?.graphUrl);
  }, [network.slug]);

  return (
    <Dialog
      isOpen={true}
      onOpenChange={(isOpen: boolean) => handleOpen(isOpen)}
    >
      {() => (
        <DialogContent>
          <Form onSubmit={handleCreateNetwork}>
            <input
              type="hidden"
              value={network.isNew?.toString() ?? 'false'}
              name="isNew"
            />
            <CardContentBlock
              title={!network.isNew ? 'Update network' : 'Create Network'}
              visual={<MonoPermScanWifi className={cardVisualClass} />}
            >
              <Stack position="relative" marginBlockEnd="xxxl">
                <Select
                  label="Select a network"
                  placeholder="Select a network"
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
                    ...new network
                  </SelectItem>
                </Select>
              </Stack>

              <Stack gap="xl" flexDirection="column">
                <TextField
                  maxLength={150}
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

                <Headers headers={network.headers} ref={refInputHeaders} />

                {network.graphUrlIsValid && (
                  <>
                    <TextField
                      isDisabled={!network.isNew}
                      maxLength={50}
                      label="Slug"
                      name="slug"
                      value={network?.slug}
                      onChange={(e) => {
                        setNetwork((v) => ({ ...v, slug: e.target.value }));
                      }}
                      isRequired
                    ></TextField>
                    <TextField
                      maxLength={50}
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
                      maxLength={50}
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

              {!isDefaultNetwork(network) ? (
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
              ) : (
                <>This network cannot be edited</>
              )}
            </CardFooter>
          </Form>
          <Stack flexDirection={'column'} gap="sm" marginBlockStart="xxxl">
            <Notification role="alert" type="inlineStacked">
              <NotificationHeading>
                Navigating to the Explorer
              </NotificationHeading>
              <div style={{ wordBreak: 'break-word' }}>
                You can pass <code>networkId</code> as querystring parameter.
                This allows Wallets or dApps to choose a specific network. For
                example, if you want to navigate to the account with the
                networkId <code>testnet04</code>, you can use the following URL:{' '}
                <code style={{ marginBlock: token('spacing.sm') }}>
                  https://explorer.kadena.io/account/k:2da46f2cc21e219c68a2f18d1a454c10606d52b18d8574913aacb2ea6b6b7251?networkId=testnet04#Transactions
                </code>
              </div>
            </Notification>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  );
};
