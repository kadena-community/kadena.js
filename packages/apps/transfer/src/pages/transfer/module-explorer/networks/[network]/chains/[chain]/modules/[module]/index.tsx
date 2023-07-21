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
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';

const ModulePage = () => {
  Debug('kadena-transfer:pages:transfer:module-explorer:module');
  const { t } = useTranslation('common');
  const [pactCode, setPactCode] = useState('');
  const [functions, setFunctions] = useState({});
  const [capabilities, setCapabilities] = useState({});
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
      const data = await describeModule(
        moduleName,
        chainId,
        typedNetwork,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );

      setPactCode(data?.code || '');

      const moduleNameParts = moduleName.split('.');
      const namespace =
        moduleNameParts.length > 1 ? moduleNameParts[0] : undefined;

      const pactModule = new StringContractDefinition({
        contract: data?.code || '',
        namespace,
      });

      console.log(pactModule);

      // setCapabilities(pactModule._raw[moduleName].defcaps);
      // setFunctions(pactModule._raw[moduleName].defuns);
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
            {!Object.keys(functions)?.length &&
              t('No functions in this module.')}
            {Object.keys(functions)?.map((key) => (
              <StyledListItem key={key}>
                <a
                  href={`/transfer/module-explorer/networks/${network}/chains/${chain}/modules/${module}/functions/${key}`}
                >
                  {key}
                </a>
              </StyledListItem>
            ))}
            <h4>{t('Capabilities')}</h4>
            {!Object.keys(capabilities)?.length &&
              t('No capabilities in this module.')}
            {Object.keys(capabilities)?.map((key) => (
              <StyledListItem key={key}>
                <a
                  href={`/transfer/module-explorer/networks/${network}/chains/${chain}/modules/${module}/capabilities/${key}`}
                >
                  {key}
                </a>
              </StyledListItem>
            ))}
            <h4>{t('Constants')}</h4>
            <h4>{t('Pacts')}</h4>
            <h4>{t('Interfaces')}</h4>
          </Details>
        </div>
      </EditorGrid>
    </Container>
  );
};
export default ModulePage;
