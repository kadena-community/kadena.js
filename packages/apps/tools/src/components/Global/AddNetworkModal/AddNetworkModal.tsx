import { Button, Stack, TextField, useModal } from '@kadena/react-ui';

import { formButtonStyle,formContentStyle,modalOptionsContentStyle  } from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// @see; https://www.geeksforgeeks.org/how-to-validate-a-domain-name-using-regular-expression/
const DOMAIN_NAME_REGEX: RegExp =
  /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

const schema = z.object({
  label: z.string().trim(),
  networkId: z.string().trim(),
  api: z.string().trim().regex(DOMAIN_NAME_REGEX, 'Invalid Domain Name'),
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
              }}
            />
            <TextField
              label={'Network ID'}
              inputProps={{
                id: 'networkId',
                ...register('networkId'),
                onChange: (e) => setNetworkId(e.target.value),
                value: networkId,
              }}
            />
            <TextField
              label={'Network api'}
              inputProps={{
                id: 'api',
                ...register('api'),
                onChange: (e) => setApi(e.target.value),
                value: api,
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
