import { displayContentsClass } from '@/Components/Sidebar/style.css';
import { INetwork } from '@/modules/network/network.repository';
import { fetchNetworkId } from '@/modules/network/network.service';
import { UUID } from '@/modules/types';
import { Label } from '@/pages/transaction/components/helpers';
import {
  failureClass,
  pendingClass,
  successClass,
} from '@/pages/transaction/components/style.css';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  MonoCircle,
  MonoDelete,
  MonoToggleOff,
  MonoToggleOn,
  MonoWarning,
} from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

export type INetworkWithOptionalUuid =
  | (Omit<INetwork, 'uuid'> & {
      uuid?: undefined;
    })
  | INetwork;

interface INewNetwork {
  uuid: UUID | undefined;
  networkId: string;
  name: string;
  disabled: boolean;
  hosts: {
    url: string;
    submit: boolean;
    read: boolean;
    confirm: boolean;
    isHealthy?: boolean;
    nodeVersion?: string;
  }[];
  faucetContract?: string;
}

export const getNewNetwork = (): INetworkWithOptionalUuid => ({
  uuid: undefined,
  networkId: '',
  disabled: false,
  name: '',
  hosts: [
    {
      url: '',
      submit: false,
      read: false,
      confirm: false,
    },
  ],
});

export function NetworkForm({
  network,
  onClose,
  onSave,
  isOpen,
}: {
  network: INetworkWithOptionalUuid;
  onSave: (network: INetworkWithOptionalUuid) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}) {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState,
  } = useForm<INewNetwork>({
    defaultValues: network,
    mode: 'all',
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'hosts' });
  const [error, setError] = useState<string>();
  async function create(updNetwork: INewNetwork) {
    setError(undefined);
    const hosts = updNetwork.hosts.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ isHealthy, nodeVersion, ...host }) => host,
    );
    try {
      await onSave({
        ...updNetwork,
        hosts,
      });
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e, 'Error on saving network'));
    }
  }

  useEffect(() => {
    reset(network ?? getNewNetwork());
  }, [network, reset]);

  const networkId = watch('networkId');

  // const hosts = watch('hosts');
  // const isNetworkIdValid =
  //   hosts.length > 0 &&
  //   networkId.length > 0 &&
  //   hosts.every((host) => host.nodeVersion === networkId);

  useEffect(() => {
    if (networkId) {
      const hosts = getValues('hosts');
      hosts.forEach(({ url }, index) =>
        fetchNetworkId(url).then((nodeVersion) => {
          setValue(`hosts.${index}.nodeVersion`, nodeVersion);
          setValue(`hosts.${index}.isHealthy`, nodeVersion !== undefined);
        }),
      );
    }
  }, [networkId, getValues, setValue]);

  return (
    <RightAside isOpen={isOpen}>
      <form onSubmit={handleSubmit(create)} className={displayContentsClass}>
        <RightAsideHeader
          label={network.uuid ? 'Edit Network' : 'Add Network'}
        />
        <RightAsideContent>
          <Stack width="100%" flexDirection="column" gap="md">
            <TextField
              autoFocus={!network.uuid}
              label="Network ID"
              aria-label="networkId"
              type="text"
              defaultValue={getValues('networkId')}
              {...register('networkId', { required: 'Network ID is required' })}
            />
            <TextField
              label="Title"
              aria-label="title"
              type="text"
              maxLength={30}
              defaultValue={getValues('name')}
              {...register('name', { required: 'Title is required' })}
            />
            <Controller
              control={control}
              name="disabled"
              render={({ field }) => (
                <Stack>
                  <Button
                    variant="outlined"
                    onClick={() => field.onChange(!field.value)}
                    endVisual={
                      field.value ? (
                        <MonoToggleOff fontSize={36} />
                      ) : (
                        <MonoToggleOn fontSize={36} className={successClass} />
                      )
                    }
                  >
                    Active
                  </Button>
                </Stack>
              )}
            />
            <Stack
              gap="md"
              justifyContent={'space-between'}
              paddingBlock={'lg'}
            >
              <Heading variant="h4">Host Urls</Heading>
              <Button
                variant="outlined"
                isCompact
                onPress={() =>
                  append({
                    url: '',
                    submit: true,
                    read: true,
                    confirm: true,
                    isHealthy: undefined,
                    nodeVersion: undefined,
                  })
                }
              >
                + host
              </Button>
            </Stack>
            <Stack gap="md" flexDirection={'column'}>
              {fields.map((field, index) => {
                const nodeVersion = watch(`hosts.${index}.nodeVersion`);
                const isHealthy = watch(`hosts.${index}.isHealthy`);
                return (
                  <Stack key={field.id} flexDirection={'column'} gap={'md'}>
                    <Label bold>Host {index + 1}</Label>
                    <Stack gap={'sm'} alignItems={'center'}>
                      <TextField
                        id={`hosts.${index}.url`}
                        type="text"
                        aria-label="url"
                        defaultValue={getValues(`hosts.${index}.url`)}
                        {...register(`hosts.${index}.url`, {
                          required: 'Host url is required',
                          onBlur: () => {
                            const host = getValues(`hosts.${index}.url`);
                            if (!host) {
                              return;
                            }
                            fetchNetworkId(host).then((nodeVersion) => {
                              setValue(
                                `hosts.${index}.nodeVersion`,
                                nodeVersion,
                              );
                              setValue(
                                `hosts.${index}.isHealthy`,
                                nodeVersion !== undefined,
                              );
                            });
                          },
                        })}
                      />
                      <MonoCircle
                        data-testid="testnetworkicon"
                        data-ishealthy={`${isHealthy}`}
                        className={classNames({
                          [successClass]: isHealthy === true,
                          [failureClass]: isHealthy === false,
                          [pendingClass]: isHealthy === undefined,
                        })}
                      />
                      <Button
                        isDisabled={fields.length === 1}
                        onPress={() => remove(index)}
                        variant="transparent"
                      >
                        <MonoDelete />
                      </Button>
                    </Stack>
                    {nodeVersion && nodeVersion !== networkId ? (
                      <Text size="smallest">
                        <Stack gap={'sm'}>
                          <MonoWarning />
                          the host networkId is <strong>
                            {nodeVersion}
                          </strong>{' '}
                          but networkId field is <strong>{networkId}</strong>
                        </Stack>
                      </Text>
                    ) : null}
                  </Stack>
                );
              })}
              {}
              <Stack gap="md" flexDirection={'column'}>
                <TextField
                  id={`faucetContract`}
                  label="Faucet Contract (Optional)"
                  type="text"
                  aria-label="url"
                  defaultValue={getValues(`faucetContract`)}
                  {...register(`faucetContract`)}
                />
              </Stack>
            </Stack>
            {error !== undefined && (
              <Notification intent="negative" role="alert">
                {error}
              </Notification>
            )}
          </Stack>
        </RightAsideContent>
        <RightAsideFooter>
          <Button variant="outlined" onPress={() => onClose()} type="reset">
            Cancel
          </Button>
          <Button
            type="submit"
            isDisabled={!formState.isDirty || !formState.isValid}
          >
            Save
          </Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
