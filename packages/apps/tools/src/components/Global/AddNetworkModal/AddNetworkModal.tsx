import { Button, Stack, TextField, useModal } from '@kadena/react-ui';

import {
  formButtonStyle,
  formContentStyle,
  modalOptionsContentStyle,
} from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  label: z.string().trim(),
  networkId: z.string().trim(),
  api: z.string().trim(),
});

type FormData = z.infer<typeof schema>;

export const AddNetworkModal: FC = () => {
  const { t } = useTranslation('common');
  const { setSelectedNetwork, setNetworksData, networksData } =
    useWalletConnectClient();

  const [label, setLabel] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [api, setApi] = useState('');

  const { clearModal } = useModal();

  const handleSave = (): void => {
    const networks = [...networksData];

    networks.push({
      label,
      networkId,
      API: api,
      apiHost: ({ networkId, chainId }) =>
        `https://${api}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      estatsHost: (account) =>
        `https://${api}/txs/account/${account}?limit=100`,
    });
    setNetworksData(networks);

    setSelectedNetwork(networkId);
    clearModal();
  };

  const { register } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      label: '',
      api: '',
      networkId: '',
    },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  return (
    <div className={modalOptionsContentStyle}>
      <form onSubmit={handleSave}>
        <section className={formContentStyle}>
          <Stack direction="column" gap="$sm">
            <TextField
              label={'Network label'}
              inputProps={{
                id: 'label',
                ...register('label'),
                onChange: (e) => setLabel(e.target.value),
                value: label,
                placeholder: 'devnet',
              }}
            />
            <TextField
              label={'Network ID'}
              inputProps={{
                id: 'networkId',
                ...register('networkId'),
                onChange: (e) => setNetworkId(e.target.value),
                value: networkId,
                placeholder: 'fast-development',
              }}
            />
            <TextField
              label={'Network api'}
              inputProps={{
                id: 'api',
                ...register('api'),
                onChange: (e) => setApi(e.target.value),
                value: api,
                placeholder: 'localhost:8080',
              }}
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
  );
};
