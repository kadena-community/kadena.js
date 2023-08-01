import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { StringContractDefinition } from '@kadena/pactjs-generator';

import { kadenaConstants, Network } from '@/constants/kadena';
import { convertIntToChainId } from '@/services/utils/utils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

import { Container, Details, EditorGrid, StyledListItem } from './styles';

import { describeModule } from '@/services/modules/describe-module';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

const ModulePage: FC = () => {
  const { t } = useTranslation('common');
  const [pactCode, setPactCode] = useState('');
  const [functions, setFunctions] = useState<
    Record<string, { method: string }> | undefined
  >({});
  const [capabilities, setCapabilities] = useState<
    Record<string, { defcap: string }> | undefined
  >({});
  const [interfaces, setInterfaces] = useState<string[]>([]);
  const router = useRouter();
  const { network, chain, module } = router.query;

  useEffect(() => {
    if (!network || !chain || !module) {
      return;
    }

    const typedNetwork = (network instanceof Array
      ? network[0]
      : network) as unknown as Network;
    const chainId: ChainwebChainId = convertIntToChainId(
      (chain instanceof Array ? chain[0] : chain) as unknown as number,
    );
    const moduleName: string = module as string;

    const fetchModule = async (): Promise<void> => {
      const { result } = await describeModule(
        moduleName,
        chainId,
        typedNetwork,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );

      if (result.status === 'failure' && 'error' in result) {
        throw new Error(JSON.stringify(result.error));
      }

      const resultSuccess = result as unknown as {
        data: {
          code: string;
          interfaces: string[];
        };
      };

      const pactCode = resultSuccess.data.code || '';
      setPactCode(pactCode);

      const moduleNameParts = moduleName.split('.');
      const namespace =
        moduleNameParts.length > 1 ? moduleNameParts[0] : undefined;

      const pactModule = new StringContractDefinition({
        contract: pactCode,
        namespace,
      });

      setCapabilities(pactModule.getCapabilities(moduleName));
      setFunctions(pactModule.getMethods(moduleName));
      setInterfaces(resultSuccess.data.interfaces || []);
    };

    fetchModule().catch(console.error);
  }, [chain, module, network]);
  return (
    <Container>
      <h1>
        {t('Module')}: {module}
      </h1>
      <h5>
        {t('Network')}: {network}
      </h5>
      <h5>
        {t('Chain')}: {chain}
      </h5>
      <EditorGrid>
        <div>
          <h3>{t('Pact')}</h3>
          <AceViewer code={pactCode} width={'100%'} />
        </div>
        <div>
          <h3>{t('Details')}</h3>
          <Details>
            <h4>{t('Functions')}</h4>
            {!Object.keys(functions || {})?.length &&
              t('No functions in this module.')}
            {Object.keys(functions || {})?.map((key) => (
              <StyledListItem key={key}>{key}</StyledListItem>
            ))}
            <h4>{t('Capabilities')}</h4>
            {!Object.keys(capabilities || {})?.length &&
              t('No capabilities in this module.')}
            {Object.keys(capabilities || {})?.map((key) => (
              <StyledListItem key={key}>{key}</StyledListItem>
            ))}
            <h4>{t('Constants')}</h4>
            <h4>{t('Pacts')}</h4>
            <h4>{t('Interfaces')}</h4>
            {interfaces.map((key) => (
              <StyledListItem key={key}>{key}</StyledListItem>
            ))}
          </Details>
        </div>
      </EditorGrid>
    </Container>
  );
};
export default ModulePage;
