import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledSideContent,
} from '@/pages/transfer/cross-chain-transfer-tracker/styles';
import {
  getTransferData,
  ITransferDataResult,
} from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { getXChainTransferInfo } from '@/services/cross-chain-transfer-tracker/get-transfer-status';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

const CrossChainTransferTracker: FC = () => {
  const { t } = useTranslation('common');
  const [requestKey, setRequestKey] = useState<string>('');
  const [data, setData] = useState<ITransferDataResult>({});
  const router = useRouter();

  useEffect(() => {
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.query]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    router.query.reqKey = requestKey;
    await router.push(router);

    try {
      const pollResult: ITransferDataResult | undefined = await getTransferData(
        {
          requestKey,
          server: 'api.testnet.chainweb.com',
          networkId: 'testnet04',
          t,
        },
      );
      console.log(pollResult);
      setData(pollResult);
      await getXChainTransferInfo();
    } catch (error) {}
  };

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <StyledSideContent>
          <SidebarMenu />
        </StyledSideContent>

        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <TextField
              label={t('Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
                value: requestKey,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Track Transfer')}>{t('Track Transfer')}</Button>
          </StyledFormButton>
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
