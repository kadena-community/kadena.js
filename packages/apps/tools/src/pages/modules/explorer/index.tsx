import type { TreeItem } from '@/components/Global/CustomTree/CustomTree';
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
import { QUERY_KEY, useModulesQuery } from '@/hooks/use-modules-query';
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
import type { QueryClient } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import React, { useCallback } from 'react';
import { getCookieValue, getQueryValue, xToY } from './utils';

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
  NETWORK: 'network',
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
    network,
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
      code: newModule.code,
    };
  });
};

/*
 * In this function we'll add the `hash` and `code` property to the module, so that, in the list of
 * modules, you can see if there are any differences in the module on certain chains.
 */
export const enrichModule = async (
  module: IModule,
  network: Network,
  networksData: INetworkData[],
  queryClient: QueryClient,
) => {
  const promises = module.chains.map((chain) => {
    return getCompleteModule(
      { moduleName: module.moduleName, chainId: chain, network },
      network,
      networksData,
    );
  });

  const moduleOnAllChains = await Promise.all(promises);

  queryClient.setQueryData<IChainModule[]>(
    ['modules', network, networksData],
    (oldData) => replaceOldWithNew(oldData!, moduleOnAllChains),
  );
};

/*
 * In this function we'll add the `hash` and `code` property to the modules, so that, in the list of
 * modules, you can see if there are any differences in the module on certain chains.
 */
export const enrichModules = async (
  modules: IModule[],
  network: Network,
  networksData: INetworkData[],
  queryClient: QueryClient,
) => {
  const promises = modules.reduce<Promise<IChainModule>[]>((acc, module) => {
    module.chains.forEach((chain) => {
      acc.push(
        getCompleteModule(
          { moduleName: module.moduleName, chainId: chain, network },
          network,
          networksData,
        ),
      );
    });
    return acc;
  }, []);

  const moduleOnAllChains = await Promise.all(promises);

  queryClient.setQueryData<IChainModule[]>(
    ['modules', network, networksData],
    (oldData) => replaceOldWithNew(oldData!, moduleOnAllChains),
  );
};

export const getServerSideProps: GetServerSideProps<{
  // data: IChainModule[];
  openedModules: IEditorProps['openedModules'];
}> = async (context) => {
  // const network = getCookieValue(
  //   StorageKeys.NETWORK,
  //   context.req.cookies,
  //   DefaultValues.NETWORK,
  // );

  const networksData = getCookieValue(
    StorageKeys.NETWORKS_DATA,
    context.req.cookies,
    getAllNetworks([]),
  );

  // const modules = await getModules(network, networksData);

  const openedModules: IEditorProps['openedModules'] = [];
  const moduleQueryValue = getQueryValue(QueryParams.MODULE, context.query);
  const chainQueryValue = getQueryValue(
    QueryParams.CHAIN,
    context.query,
    (value) => CHAINS.includes(value),
  );
  const networkQueryValue = getQueryValue(QueryParams.NETWORK, context.query);
  if (moduleQueryValue && chainQueryValue && networkQueryValue) {
    const moduleResponse = (await describeModule(
      moduleQueryValue,
      chainQueryValue as ChainwebChainId,
      networkQueryValue,
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
        network: networkQueryValue,
      });
    }
  }

  return { props: { openedModules } };
};

const ModuleExplorerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const queryClient = useQueryClient();

  const router = useRouter();

  useToolbar(menuData, router.pathname);

  // const { data: modules } = useQuery({
  //   queryKey: ['modules', network, networksData],
  //   queryFn: () => getModules(network, networksData),
  //   initialData: props.data,
  //   staleTime: 1500, // We need to set this in combination with initialData, otherwise the query will immediately refetch when it mounts
  //   refetchOnWindowFocus: false,
  // });
  const modules = [];

  // const mainnetModulesQuery = useQuery({
  //   queryKey: ['modules-mainnet'],
  //   queryFn: () => {},
  //   staleTime: Infinity,
  // });
  // const testnetModulesQuery = useQuery({
  //   queryKey: ['modules-testnet'],
  //   queryFn: () => {},
  //   staleTime: Infinity,
  // });
  const mainnetModulesQuery = useModulesQuery('mainnet01');
  const testnetModulesQuery = useModulesQuery('testnet04');

  console.log({ mainnetModulesQuery, testnetModulesQuery });

  let mappedMainnet: TreeItem<string>[] = [];
  let amountOfMainnetModules = 0;

  if (mainnetModulesQuery.isSuccess) {
    mappedMainnet = xToY(mainnetModulesQuery.data);
    amountOfMainnetModules = mainnetModulesQuery.data.reduce((prev, acc) => {
      return prev + acc.length;
    }, 0);
    console.log(mappedMainnet);
  }

  let mappedTestnet: TreeItem<string>[] = [];
  let amountOfTestnetModules = 0;

  if (testnetModulesQuery.isSuccess) {
    mappedTestnet = xToY(testnetModulesQuery.data);
    amountOfTestnetModules = testnetModulesQuery.data.reduce((prev, acc) => {
      return prev + acc.length;
    }, 0);
    console.log(mappedTestnet);
  }

  // const customNetworks = networksData.filter(
  //   (n) => n.networkId !== 'mainnet01' && n.networkId !== 'testnet04',
  // );
  // const customNetworksQueries = useQueries({
  //   queries: customNetworks.map((customNetwork) => ({
  //     queryKey: ['modules-custom', customNetwork.networkId],
  //     queryFn: () => {},
  //     staleTime: Infinity,
  //   })),
  // });

  const setDeepLink = useCallback(
    (module: IChainModule) => {
      void router.replace(
        `?${QueryParams.MODULE}=${module.moduleName}&${QueryParams.CHAIN}=${module.chainId}&${QueryParams.NETWORK}=${module.network}`,
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const onModuleOpen = useCallback<(module: IChainModule) => void>(
    (module) => {
      setDeepLink(module);
    },
    [setDeepLink],
  );

  return (
    <>
      <Head>
        <title>Kadena Developer Tools - Modules</title>
      </Head>
      <ModuleExplorer
        // modules={modules}
        // onModuleClick={onModuleOpen}
        // onInterfaceClick={onModuleOpen}
        // onModuleExpand={({ moduleName, chains }) => {
        //   void enrichModule(
        //     { moduleName, chains },
        //     network,
        //     networksData,
        //     queryClient,
        //   );
        // }}
        // onInterfacesExpand={(interfaces) => {
        //   void enrichModules(
        //     interfaces.map((i) => ({
        //       chains: [i.chainId],
        //       moduleName: i.moduleName,
        //     })),
        //     network,
        //     networksData,
        //     queryClient,
        //   );
        // }}
        // onActiveModuleChange={setDeepLink}
        // onTabClose={(module) => {
        //   console.log('closing', module);
        // }}
        // openedModules={props.openedModules}
        data={'something'}
        items={[
          {
            title: 'Mainnet',
            key: 'mainnet',
            children: mappedMainnet,
            data: 'mainnet',
            isLoading: mainnetModulesQuery.isFetching,
            label: amountOfMainnetModules,
          },
          {
            title: 'Testnet',
            key: 'testnet',
            children: mappedTestnet,
            data: 'testnet',
            isLoading: testnetModulesQuery.isFetching,
            label: amountOfTestnetModules,
          },
        ]}
        onReload={(data) => {
          console.log('reload', data);
          void queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEY,
              data === 'mainnet' ? 'mainnet01' : 'testnet04',
            ],
          });
        }}
      />
    </>
  );
};

export default ModuleExplorerPage;
