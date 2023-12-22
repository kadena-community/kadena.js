import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IDialogProps } from '@kadena/react-ui';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  TextField,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { formButtonStyle, modalOptionsContentStyle } from './styles.css';

const schema = z.object({
  label: z.string().trim().min(1),
  networkId: z.string().trim().min(1),
  api: z.string().trim().min(1),
});

type FormData = z.infer<typeof schema>;
interface IAddNetworkModalProps extends IDialogProps {}

export const AddNetworkModal: FC<IAddNetworkModalProps> = (props) => {
  const { t } = useTranslation('common');
  const { setSelectedNetwork, setNetworksData, networksData } =
    useWalletConnectClient();

  const [label, setLabel] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [api, setApi] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [networkId]);

  const handleSubmit = (data: FormData, callback: () => void) => {
    const networks = [...networksData];
    const { networkId, label, api } = data;

    const isDuplicate = networks.find(
      (item) => item.networkId === networkId && item.label === label,
    );

    if (isDuplicate) {
      setError('Error: Duplicate NetworkId');
      return;
    }

    networks.push({
      label,
      networkId,
      API: api,
      ESTATS: api,
    });
    setNetworksData(networks);

    setSelectedNetwork(networkId);
    callback();
  };

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <Dialog {...props}>
      {(state) => (
        <>
          <DialogHeader>Add Network</DialogHeader>
          <DialogContent>
            <div className={modalOptionsContentStyle}>
              <form
                onSubmit={validateThenSubmit((data) => {
                  handleSubmit(data, () => state.close());
                })}
              >
                <section>
                  <Stack direction="column" gap="$sm">
                    <TextField
                      label={t('Network label')}
                      id="label"
                      {...register('label')}
                      onChange={(e) => setLabel(e.target.value)}
                      value={label}
                      placeholder="devnet"
                      status={errors?.label ? 'negative' : undefined}
                      helperText={errors?.label?.message ?? ''}
                    />
                    <TextField
                      label={t('Network ID')}
                      id="networkId"
                      {...register('networkId')}
                      onChange={(e) => setNetworkId(e.target.value)}
                      value={networkId}
                      placeholder="fast-development"
                      status={errors?.networkId ? 'negative' : undefined}
                      helperText={errors?.networkId?.message ?? ''}
                    />
                    <TextField
                      label={t('Network api')}
                      id="api"
                      {...register('api')}
                      onChange={(e) => setApi(e.target.value)}
                      value={api}
                      placeholder="localhost:8080"
                      status={errors?.api ? 'negative' : undefined}
                      helperText={errors?.api?.message ?? ''}
                    />
                  </Stack>
                </section>
                <section className={formButtonStyle}>
                  <Button type="submit" icon="TrailingIcon">
                    {t('Save Network')}
                  </Button>
                </section>
              </form>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
