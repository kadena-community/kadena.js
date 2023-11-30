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
import React from 'react';
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

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (data: FormData, callback: () => void) => {
    const networks = [...networksData];
    const { networkId, label, api } = data;

    const isDuplicate = networks.find(
      (item) => item.networkId === networkId && item.label === label,
    );
    if (isDuplicate) {
      setError('networkId', {
        message: 'Error: Duplicate NetworkId',
      });
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
                      inputProps={{
                        id: 'label',
                        ...register('label'),
                        placeholder: 'devnet',
                      }}
                      status={errors?.label ? 'negative' : undefined}
                      helperText={errors?.label?.message ?? ''}
                    />
                    <TextField
                      label={t('Network ID')}
                      inputProps={{
                        id: 'networkId',
                        ...register('networkId', {
                          onChange: () => {
                            clearErrors('networkId');
                          },
                        }),
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
                        placeholder: 'http://localhost:8080',
                      }}
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
