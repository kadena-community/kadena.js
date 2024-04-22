import ModuleExplorer from '@/components/Global/ModuleExplorer';
import type { IEditorProps } from '@/components/Global/ModuleExplorer/editor';
import type {
  IChainModule,
  IModule,
} from '@/components/Global/ModuleExplorer/types';
import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
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
import type {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { Breadcrumbs, BreadcrumbsItem } from '@kadena/react-ui';
import type { QueryClient } from '@tanstack/react-query';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import React, { useCallback, useState } from 'react';
import { getCookieValue, getQueryValue } from './utils';

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
};

export const getModules = async (
  network: Network,
  networksData: INetworkData[],
): Promise<IChainModule[]> => {
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
  { moduleName, chainId }: IChainModule,
  network: Network,
  networksData: INetworkData[],
): Promise<IChainModule> => {
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

  const { code, hash } = request.result.data as unknown as {
    code: string;
    hash: string;
  };

  return {
    code,
    moduleName,
    chainId,
    hash,
  };
};

const replaceOldWithNew = (
  oldData: IChainModule[],
  newData: IChainModule[],
): IChainModule[] => {
  return oldData.map((old) => {
    const newModule = newData.find((newM) => {
      return newM.moduleName === old.moduleName && newM.chainId === old.chainId;
    });

    if (!newModule) {
      return old;
    }

    return {
      ...old,
      hash: newModule.hash,
    };
  });
};

/*
 * In this function we'll add the `hash` property to the module, so that, in the list of modules,
 * you can see if there are any differences in the module on certain chains.
 */
export const enrichModule = async (
  module: IModule,
  network: Network,
  networksData: INetworkData[],
  queryClient: QueryClient,
) => {
  const promises = module.chains.map((chain) => {
    return getCompleteModule(
      { moduleName: module.moduleName, chainId: chain },
      network,
      networksData,
    );
  });

  const moduleOnAllChains = await Promise.all(promises);

  queryClient.setQueryData(['modules', network, networksData], (oldData) =>
    replaceOldWithNew(oldData as IChainModule[], moduleOnAllChains),
  );
};

export const getServerSideProps: GetServerSideProps<{
  data: IChainModule[];
  openedModules: IEditorProps['openedModules'];
}> = async (context) => {
  const network = getCookieValue(
    StorageKeys.NETWORK,
    context.req.cookies,
    DefaultValues.NETWORK,
  );

  const networksData = getCookieValue(
    StorageKeys.NETWORKS_DATA,
    context.req.cookies,
    getAllNetworks([]),
  );

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

  const [openedModules, setOpenedModules] = useState<IChainModule[]>(
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

  const queryClient = useQueryClient();

  const cached = queryClient.getQueriesData({
    queryKey: ['module', network],
    type: 'active',
  });
  let fetchedModules: IEditorProps['openedModules'] = cached
    .filter(([, data]) => Boolean(data))
    .map(([, data]) => data as IChainModule);
  if (results.every((result) => result.status === 'success')) {
    fetchedModules = results.map((result) => result.data as IChainModule);
  }

  const router = useRouter();

  const setDeeplink = useCallback(
    (module: IChainModule) => {
      // eslint-disable-next-line no-void
      void router.replace(
        `?${QueryParams.MODULE}=${module.moduleName}&${QueryParams.CHAIN}=${module.chainId}`,
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const openModule = useCallback<(selectedModule: IChainModule) => void>(
    (selectedModule) => {
      setOpenedModules([selectedModule]);

      setDeeplink(selectedModule);
    },
    [setDeeplink],
  );

  const onInterfaceClick = useCallback<
    (selectedInterface: IChainModule) => void
  >((selectedInterface) => {
    setOpenedModules((prev) => {
      const alreadyOpened = prev.find((module) => {
        return (
          module.moduleName === selectedInterface.moduleName &&
          module.chainId === selectedInterface.chainId
        );
      });

      if (alreadyOpened) {
        return prev;
      }
      return [...prev, selectedInterface];
    });
  }, []);

  const { t } = useTranslation('common');

  useToolbar(menuData, router.pathname);

  return (
    <>
      <Head>
        <title>Kadena Developer Tools - Modules</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Modules')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Explorer')}</BreadcrumbsItem>
      </Breadcrumbs>
      <ModuleExplorer
        modules={modules}
        onModuleClick={openModule}
        onInterfaceClick={onInterfaceClick}
        onModuleExpand={({ moduleName, chains }) => {
          // eslint-disable-next-line no-void
          void enrichModule(
            { moduleName, chains },
            network,
            networksData,
            queryClient,
          );
        }}
        onActiveModuleChange={setDeeplink}
        openedModules={fetchedModules}
      />
    </>
  );
};

export default ModuleExplorerPage;
