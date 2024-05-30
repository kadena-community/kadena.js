import type { TreeItem } from '@/components/Global/CustomTree/CustomTree';
import ModuleExplorer from '@/components/Global/ModuleExplorer';
import type { IEditorProps } from '@/components/Global/ModuleExplorer/editor';
import type { IChainModule } from '@/components/Global/ModuleExplorer/types';
import type { ContractInterface } from '@/components/Global/ModuleExplorer/utils';
import { kadenaConstants } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { StorageKeys } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useModuleQuery } from '@/hooks/use-module-query';
import { QUERY_KEY, useModulesQuery } from '@/hooks/use-modules-query';
import { describeModule } from '@/services/modules/describe-module';
import { getAllNetworks } from '@/utils/network';
import type {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { useQueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import React, { useCallback } from 'react';
import type { IncompleteModuleModel } from './utils';
import {
  getCookieValue,
  getQueryValue,
  isModule,
  modelsToTreeItems,
} from './utils';

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
  NETWORK: 'network',
};

export const getServerSideProps: GetServerSideProps<{
  openedModules: IEditorProps['openedModules'];
}> = async (context) => {
  const networksData = getCookieValue(
    StorageKeys.NETWORKS_DATA,
    context.req.cookies,
    getAllNetworks([]),
  );

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
  const queryClient = useQueryClient();

  const router = useRouter();

  useToolbar(menuData, router.pathname);

  const mainnetModulesQuery = useModulesQuery('mainnet01');
  const testnetModulesQuery = useModulesQuery('testnet04');

  let mappedMainnet: TreeItem<IncompleteModuleModel>[] = [];
  let amountOfMainnetModules = 0;

  if (mainnetModulesQuery.isSuccess) {
    mappedMainnet = modelsToTreeItems(mainnetModulesQuery.data, 'mainnet');
    amountOfMainnetModules = mainnetModulesQuery.data.length;
  }

  let mappedTestnet: TreeItem<IncompleteModuleModel>[] = [];
  let amountOfTestnetModules = 0;

  if (testnetModulesQuery.isSuccess) {
    mappedTestnet = modelsToTreeItems(testnetModulesQuery.data, 'testnet');
    amountOfTestnetModules = testnetModulesQuery.data.length;
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

  const mutation = useModuleQuery();

  return (
    <>
      <Head>
        <title>Kadena Developer Tools - Modules</title>
      </Head>
      <ModuleExplorer
        onModuleClick={(x) => {
          onModuleOpen({
            chainId: x.data.chainId,
            moduleName: x.data.name,
            network: x.data.networkId,
          });
        }}
        onActiveModuleChange={(x) => {
          setDeepLink(x);
        }}
        // onTabClose={(module) => {
        //   console.log('closing', module);
        // }}
        openedModules={props.openedModules}
        items={[
          {
            title: 'Mainnet',
            key: 'mainnet',
            children: mappedMainnet,
            data: { name: 'mainnet01', chainId: '0', networkId: 'mainnet01' },
            isLoading: mainnetModulesQuery.isFetching,
            supportsReload: true,
            label: amountOfMainnetModules,
          },
          {
            title: 'Testnet',
            key: 'testnet',
            children: mappedTestnet,
            data: { name: 'testnet04', chainId: '0', networkId: 'testnet04' },
            isLoading: testnetModulesQuery.isFetching,
            supportsReload: true,
            label: amountOfTestnetModules,
          },
        ]}
        onReload={(data) => {
          void queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEY,
              data.key === 'mainnet' ? 'mainnet01' : 'testnet04',
            ],
          });
        }}
        onExpandCollapse={async (data, expanded) => {
          if (!expanded) return;

          const isLowestLevel = !data.children[0].children.length;

          if (data.key === 'interfaces') {
            const network = (data.children[0].data as ContractInterface)
              .networkId;
            const networkId =
              network === 'mainnet01' ? 'mainnet01' : 'testnet04';

            const promises = data.children.map(({ data }) => {
              return mutation.mutateAsync({
                module: (data as ContractInterface).name,
                networkId,
                chainId: (data as ContractInterface).chainId,
              });
            });

            const results = await Promise.all(promises);

            queryClient.setQueryData<Array<IncompleteModuleModel>>(
              [QUERY_KEY, networkId, undefined],
              (oldData) => {
                return oldData!.map((old) => {
                  const newModule = results.find((newM) => {
                    return (
                      newM.name === old.name && newM.chainId === old.chainId
                    );
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
              },
            );
          } else if (isModule(data.data) && isLowestLevel) {
            const [network, namespacePart1, namespacePart2] = (
              data.key as string
            ).split('.');
            const networkId = network === 'mainnet' ? 'mainnet01' : 'testnet04';
            const promises = data.children.map(({ data }) => {
              return mutation.mutateAsync({
                module: `${namespacePart1}${namespacePart2 ? `.${namespacePart2}` : ''}`,
                networkId,
                chainId: (data as IncompleteModuleModel).chainId,
              });
            });

            const results = await Promise.all(promises);

            queryClient.setQueryData<Array<IncompleteModuleModel>>(
              [QUERY_KEY, networkId, undefined],
              (oldData) => {
                return oldData!.map((old) => {
                  const newModule = results.find((newM) => {
                    return (
                      newM.name === old.name && newM.chainId === old.chainId
                    );
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
              },
            );
          }
        }}
      />
    </>
  );
};

export default ModuleExplorerPage;
