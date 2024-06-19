import ModuleExplorer from '@/components/Global/ModuleExplorer';
import type { IEditorProps } from '@/components/Global/ModuleExplorer/editor';
import { isModuleLike } from '@/components/Global/ModuleExplorer/types';
import { menuData } from '@/constants/side-menu-items';
import { useLayoutContext, useToolbar } from '@/context/layout-context';
import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import { fetchModule, useModuleQuery } from '@/hooks/use-module-query';
import { QUERY_KEY, useModulesQuery } from '@/hooks/use-modules-query';
import type { IPageProps } from '@/pages/_app';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
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
import { getQueryValue } from './utils';

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
  NETWORK: 'network',
};

export const getServerSideProps: GetServerSideProps<
  IPageProps & {
    openedModules: IEditorProps['openedModules'];
  }
> = async (context) => {
  const openedModules: IEditorProps['openedModules'] = [];
  const moduleQueryValue = getQueryValue(QueryParams.MODULE, context.query);
  const chainQueryValue = getQueryValue(
    QueryParams.CHAIN,
    context.query,
    (value) => CHAINS.includes(value),
  );
  const networkQueryValue = getQueryValue(QueryParams.NETWORK, context.query);
  if (moduleQueryValue && chainQueryValue && networkQueryValue) {
    try {
      const fetchedModule = await fetchModule(
        moduleQueryValue,
        networkQueryValue as ChainwebNetworkId,
        chainQueryValue as ChainwebChainId,
      );

      openedModules.push(fetchedModule);
    } catch (e) {
      console.error('Something went wrong while fetching the module', e);
    }
  }

  return {
    props: {
      openedModules,
      menuInitiallyOpened: false,
      useFullPageWidth: true,
    },
  };
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

  // let mappedMainnet: TreeItem<IncompleteModuleModel>[] = [];
  // let amountOfMainnetModules = 0;

  // if (mainnetModulesQuery.isSuccess) {
  //   mappedMainnet = mapToTreeItems(
  //     modelsToTreeMap(mainnetModulesQuery.data),
  //     'mainnet',
  //   );
  //   amountOfMainnetModules = mainnetModulesQuery.data.length;
  // }

  // let mappedTestnet: TreeItem<IncompleteModuleModel>[] = [];
  // let amountOfTestnetModules = 0;

  // if (testnetModulesQuery.isSuccess) {
  //   console.log(
  //     'lets search',
  //     new Fuse(testnetModulesQuery.data, {
  //       keys: ['name'],
  //       includeScore: true,
  //       // findAllMatches: true,
  //     }).search('fuacet'),
  //   );

  //   mappedTestnet = mapToTreeItems(
  //     modelsToTreeMap(testnetModulesQuery.data),
  //     'testnet',
  //   );
  //   amountOfTestnetModules = testnetModulesQuery.data.length;
  // }

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
    (module: IncompleteModuleModel) => {
      void router.replace(
        `?${QueryParams.MODULE}=${module.name}&${QueryParams.CHAIN}=${module.chainId}&${QueryParams.NETWORK}=${module.networkId}`,
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const onModuleOpen = useCallback<(module: IncompleteModuleModel) => void>(
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
          onModuleOpen(treeItem.data);
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
            key: 'mainnet01',
            data: mainnetModulesQuery.data!,
            isLoading: mainnetModulesQuery.isFetching,
            supportsReload: true,
          },
          {
            title: 'Testnet',
            key: 'testnet04',
            data: testnetModulesQuery.data!,
            isLoading: testnetModulesQuery.isFetching,
            supportsReload: true,
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

          const isLowestLevel = !treeItem.children[0]?.children.length;

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
