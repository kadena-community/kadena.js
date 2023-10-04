import type {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { Breadcrumbs } from '@kadena/react-ui';

import { getCookieValue, getQueryValue } from './utils';

import type { IModule } from '@/components/Global/ModuleExplorer';
import ModuleExplorer from '@/components/Global/ModuleExplorer';
import type { IEditorProps } from '@/components/Global/ModuleExplorer/editor';
import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import Routes from '@/constants/routes';
import {
  DefaultValues,
  StorageKeys,
  useWalletConnectClient,
} from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { describeModule } from '@/services/modules/describe-module';
import type { IModulesResult } from '@/services/modules/list-module';
import { listModules } from '@/services/modules/list-module';
import { transformModulesRequest } from '@/services/utils/transform';
import type { INetworkData } from '@/utils/network';
import { getAllNetworks } from '@/utils/network';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import useTranslation from 'next-translate/useTranslation';
import React, { useCallback, useState } from 'react';

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
};

export const getModules = async (
  network: Network,
  networksData: INetworkData[],
): Promise<IModule[]> => {
  const promises = CHAINS.map((chain) => {
    return listModules(
      chain,
      network,
      networksData,
      kadenaConstants.DEFAULT_SENDER,
      kadenaConstants.GAS_PRICE,
      1000,
    );
  });

  const results = await Promise.all(promises);

  const transformed = results.map((result) =>
    transformModulesRequest(result as IModulesResult),
  );
  const flattened = transformed.flat();
  const sorted = flattened.sort((a, b) => {
    if (a.moduleName === b.moduleName) {
      return parseInt(a.chainId, 10) - parseInt(b.chainId, 10);
    }
    return a.moduleName.localeCompare(b.moduleName);
  });

  return sorted;
};

export const getCompleteModule = async (
  { moduleName, chainId }: IModule,
  network: Network,
  networksData: INetworkData[],
): Promise<IModule & { code: string }> => {
  const request = (await describeModule(
    moduleName,
    chainId,
    network,
    networksData,
    kadenaConstants.DEFAULT_SENDER,
    kadenaConstants.GAS_PRICE,
    1000,
  )) as ILocalCommandResult;

  if (request.result.status === 'failure') {
    throw new Error('Something went wrong');
  }

  return {
    code: (request.result.data as unknown as { code: string }).code,
    moduleName,
    chainId,
  };
};

export const getServerSideProps: GetServerSideProps<{
  data: IModule[];
  openedModules: IEditorProps['openedModules'];
}> = async (context) => {
  const network = getCookieValue(
    StorageKeys.NETWORK,
    context.req.headers.cookie ?? '',
    DefaultValues.NETWORK,
  ) as Network;

  let networksData = getCookieValue(
    StorageKeys.NETWORKS_DATA,
    context.req.headers.cookie ?? '',
  ) as INetworkData[];

  if (!networksData) {
    networksData = getAllNetworks([]);
  }

  const modules = await getModules(network, networksData);

  const openedModules: IEditorProps['openedModules'] = [];
  const moduleQueryValue = getQueryValue(QueryParams.MODULE, context.query);
  const chainQueryValue = getQueryValue(
    QueryParams.CHAIN,
    context.query,
    (value) => CHAINS.includes(value),
  );
  if (moduleQueryValue && chainQueryValue) {
    const moduleResponse = (await describeModule(
      moduleQueryValue,
      chainQueryValue as ChainwebChainId,
      network,
      networksData,
      kadenaConstants.DEFAULT_SENDER,
      kadenaConstants.GAS_PRICE,
      1000,
    )) as ILocalCommandResult;

    if (moduleResponse.result.status !== 'failure') {
      openedModules.push({
        code: (moduleResponse.result.data as unknown as { code: string }).code,
        moduleName: moduleQueryValue,
        chainId: chainQueryValue as ChainwebChainId,
      });
    }
  }

  return { props: { data: modules, openedModules } };
};

const ModuleExplorerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const [openedModules, setOpenedModules] = useState<IModule[]>(
    props.openedModules,
  );

  const { data: modules } = useQuery({
    queryKey: ['modules', network, networksData],
    queryFn: () => getModules(network, networksData),
    initialData: props.data,
    staleTime: 1500, // We need to set this in combination with initialData, otherwise the query will immediately refetch when it mounts
    refetchOnWindowFocus: false,
  });

  const results = useQueries({
    queries: openedModules.map((module) => {
      return {
        queryKey: [
          'module',
          network,
          module.chainId,
          module.moduleName,
          networksData,
        ],
        queryFn: () => getCompleteModule(module, network, networksData),
        initialData: () => {
          return props.openedModules.find((openedModule) => {
            return (
              openedModule.moduleName === module.moduleName &&
              openedModule.chainId === module.chainId
            );
          });
        },
        staleTime: 1500, // We need to set this in combination with initialData, otherwise the query will immediately refetch when it mounts
        refetchOnWindowFocus: false,
      };
    }),
  });

  let fetchedModules: IEditorProps['openedModules'] = [];
  if (results.every((result) => result.status === 'success')) {
    fetchedModules = results.map(
      (result) => result.data as IModule & { code: string },
    );
  }

  const router = useRouter();

  const onModuleClick = useCallback<(selectedModule: IModule) => void>(
    (selectedModule) => {
      setOpenedModules([selectedModule]);

      // eslint-disable-next-line no-void
      void router.replace(
        `?${QueryParams.MODULE}=${selectedModule.moduleName}&${QueryParams.CHAIN}=${selectedModule.chainId}`,
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const { t } = useTranslation('common');

  useToolbar([
    {
      title: t('Cross Chain'),
      icon: 'Transition',
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Finalize Cross Chain'),
      icon: 'TransitionMasked',
      href: Routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      title: t('Module Explorer'),
      icon: 'Earth',
      href: Routes.MODULE_EXPLORER,
    },
  ]);

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Module Explorer')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <ModuleExplorer
        modules={modules}
        onModuleClick={onModuleClick}
        openedModules={fetchedModules}
      />
    </>
  );
};

export default ModuleExplorerPage;
