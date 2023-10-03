import { Button, Stack, TextField, useModal } from '@kadena/react-ui';

import {
  errorMessageStyle,
  formButtonStyle,
  modalOptionsContentStyle,
} from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  label: z
    .string({
      required_error: 'reqired field',
    })
    .trim()
    .min(1),
  networkId: z.string().trim().min(1),
  api: z.string().trim().min(1),
});

type FormData = z.infer<typeof schema>;

export const AddNetworkModal: FC = () => {
  const { t } = useTranslation('common');
  const { setSelectedNetwork, setNetworksData, networksData } =
    useWalletConnectClient();

  const [label, setLabel] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [api, setApi] = useState('');

  const [error, setError] = useState('');

  const { clearModal } = useModal();

  useEffect(() => {
    setError('');
  }, [networkId]);

  const handleSubmit = async (data: FormData): Promise<void> => {
    const networks = [...networksData];

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
    clearModal();
  };

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className={modalOptionsContentStyle}>
      <form onSubmit={validateThenSubmit(handleSubmit)}>
        <section>
          <Stack direction="column" gap="$sm">
            <TextField
              label={t('Network label')}
              inputProps={{
                id: 'label',
                ...register('label'),
                onChange: (e) => setLabel(e.target.value),
                value: label,
                placeholder: 'devnet',
              }}
              status={errors?.label ? 'negative' : undefined}
              helperText={errors?.label?.message ?? ''}
            />
            <TextField
              label={t('Network ID')}
              inputProps={{
                id: 'networkId',
                ...register('networkId'),
                onChange: (e) => setNetworkId(e.target.value),
                value: networkId,
                placeholder: 'fast-development',
              }}
              status={errors?.networkId ? 'negative' : undefined}
              helperText={errors?.networkId?.message ?? ''}
            />
            <TextField
              label={t('Network api')}
              inputProps={{
                id: 'api',
                ...register('api'),
                onChange: (e) => setApi(e.target.value),
                value: api,
                placeholder: 'localhost:8080',
              }}
              status={errors?.api ? 'negative' : undefined}
              helperText={errors?.api?.message ?? ''}
            />
          </Stack>
          <div className={errorMessageStyle}>
            <span>{error}</span>
          </div>
        </section>
        <section className={formButtonStyle}>
          <Button type="submit" icon="TrailingIcon" disabled={Boolean(error)}>
            {t('Save Network')}
          </Button>
        </section>
      </form>
    </div>
  );
};
