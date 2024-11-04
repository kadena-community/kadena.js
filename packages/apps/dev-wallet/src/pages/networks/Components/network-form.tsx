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
import { MonoCircle, MonoDelete, MonoWarning } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text, TextField } from '@kadena/kode-ui';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export type INetworkWithOptionalUuid =
  | (Omit<INetwork, 'uuid'> & {
      uuid?: undefined;
    })
  | INetwork;

interface INewNetwork {
  uuid: UUID | undefined;
  networkId: string;
  name: string;
  hosts: {
    url: string;
    submit: boolean;
    read: boolean;
    confirm: boolean;
    isHealthy?: boolean;
    nodeVersion?: string;
  }[];
}

export function NetworkForm({
  network,
  onSave: onDone,
}: {
  network: INetworkWithOptionalUuid;
  onSave: (network: INetworkWithOptionalUuid) => void;
}) {
  console.log('network', network);
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState,
  } = useForm<INewNetwork>({
    defaultValues: network,
    mode: 'all',
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'hosts' });
  async function create(updNetwork: INewNetwork) {
    const hosts = updNetwork.hosts.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ isHealthy, nodeVersion, ...host }) => host,
    );
    onDone({
      ...updNetwork,
      hosts,
    });
  }

  const hosts = watch('hosts');
  const networkId = watch('networkId');

  console.log({ hosts, networkId });

  const isNetworkIdValid =
    hosts.length > 0 &&
    networkId.length > 0 &&
    hosts.every((host) => host.nodeVersion === networkId);

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
    <>
      <Stack margin="md" gap={'md'} flexDirection={'column'}>
        <form onSubmit={handleSubmit(create)} className={displayContentsClass}>
          <TextField
            label="Network ID"
            aria-label="networkId"
            type="text"
            defaultValue={getValues('networkId')}
            {...register('networkId')}
          />
          <TextField
            label="Title"
            aria-label="title"
            type="text"
            defaultValue={getValues('name')}
            {...register('name')}
          />
          <Stack gap="md" justifyContent={'space-between'} paddingBlock={'lg'}>
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
                        onBlur: () => {
                          const host = getValues(`hosts.${index}.url`);
                          if (!host) {
                            return;
                          }
                          fetchNetworkId(host).then((nodeVersion) => {
                            setValue(`hosts.${index}.nodeVersion`, nodeVersion);
                            setValue(
                              `hosts.${index}.isHealthy`,
                              nodeVersion !== undefined,
                            );
                          });
                        },
                      })}
                    />
                    <MonoCircle
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
                        the host networkId is <strong>{nodeVersion}</strong> but
                        networkId field is <strong>{networkId}</strong>
                      </Stack>
                    </Text>
                  ) : null}
                </Stack>
              );
            })}
          </Stack>
          <Button
            type="submit"
            isDisabled={!isNetworkIdValid || !formState.isDirty}
          >
            Save
          </Button>
        </form>
      </Stack>
    </>
  );
}
