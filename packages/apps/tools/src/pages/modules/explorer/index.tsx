import type { TreeItem } from '@/components/Global/CustomTree/CustomTree';
import ModuleExplorer from '@/components/Global/ModuleExplorer';
import type { IEditorProps } from '@/components/Global/ModuleExplorer/editor';
import type { IChainModule } from '@/components/Global/ModuleExplorer/types';
import { isModuleLike } from '@/components/Global/ModuleExplorer/types';
import { moduleModelToChainModule } from '@/components/Global/ModuleExplorer/utils';
import { kadenaConstants } from '@/constants/kadena';
import { menuData } from '@/constants/side-menu-items';
import { StorageKeys } from '@/context/connect-wallet-context';
import { useLayoutContext, useToolbar } from '@/context/layout-context';
import type { IncompleteModuleModel } from '@/hooks/use-module-query';
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
import React, { useCallback, useEffect } from 'react';
import {
  getCookieValue,
  getQueryValue,
  mapToTreeItems,
  modelsToTreeMap,
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
  const { setIsMenuOpen } = useLayoutContext();

  useEffect(() => {
    // For this page we don't want the menu to be open (we only have one menu item)
    setIsMenuOpen(false);

    return () => {
      // Reopen the menu when the user navigates away
      setIsMenuOpen(true);
    };
  }, [setIsMenuOpen]);

  const queryClient = useQueryClient();

  const router = useRouter();

  useToolbar(menuData, router.pathname);

  const mainnetModulesQuery = useModulesQuery('mainnet01');
  const testnetModulesQuery = useModulesQuery('testnet04');

  let mappedMainnet: TreeItem<IncompleteModuleModel>[] = [];
  let amountOfMainnetModules = 0;

  if (mainnetModulesQuery.isSuccess) {
    mappedMainnet = mapToTreeItems(
      modelsToTreeMap(mainnetModulesQuery.data),
      'mainnet',
    );
    amountOfMainnetModules = mainnetModulesQuery.data.length;
  }

  let mappedTestnet: TreeItem<IncompleteModuleModel>[] = [];
  let amountOfTestnetModules = 0;

  if (testnetModulesQuery.isSuccess) {
    mappedTestnet = mapToTreeItems(
      modelsToTreeMap(testnetModulesQuery.data),
      'testnet',
    );
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
        onModuleClick={(treeItem) => {
          onModuleOpen(moduleModelToChainModule(treeItem.data));
        }}
        onActiveModuleChange={(module) => {
          setDeepLink(module);
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
        onReload={(treeItem) => {
          void queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEY,
              treeItem.key === 'mainnet' ? 'mainnet01' : 'testnet04',
            ],
          });
        }}
        onExpandCollapse={async (treeItem, expanded) => {
          if (!expanded) return;

          const isLowestLevel = !treeItem.children[0].children.length;

          if (isModuleLike(treeItem.data)) {
            if (treeItem.key === 'interfaces' || isLowestLevel) {
              const promises = treeItem.children.map(({ data }) => {
                return mutation.mutateAsync({
                  module: (data as IncompleteModuleModel).name,
                  networkId: (data as IncompleteModuleModel).networkId,
                  chainId: (data as IncompleteModuleModel).chainId,
                });
              });

              const results = await Promise.all(promises);

              queryClient.setQueryData<Array<IncompleteModuleModel>>(
                [QUERY_KEY, treeItem.data.networkId, undefined],
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
          }
        }}
      />
    </>
  );
};

export default ModuleExplorerPage;
