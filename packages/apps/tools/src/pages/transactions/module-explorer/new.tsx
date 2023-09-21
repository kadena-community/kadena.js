import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import {
  Box,
  Breadcrumbs,
  Card,
  Grid,
  Heading,
  SystemIcon,
  Text,
  TextField,
} from '@kadena/react-ui';

import ModulesTable from './modules-table';

import { ChainSelect } from '@/components/Global';
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
import { listModules } from '@/services/modules/list-module';
import { transformModulesRequest } from '@/services/utils/transform';
import { getName, parse } from '@/utils/persist';
import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import type { ParsedUrlQuery } from 'querystring';
import React, { useCallback, useState, useTransition } from 'react';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IModule {
  chainId: ChainwebChainId;
  moduleName: string;
}

export const getModules = async (network: Network): Promise<IModule[]> => {
  const promises = CHAINS.map((chain) => {
    return listModules(
      chain,
      network,
      kadenaConstants.DEFAULT_SENDER,
      kadenaConstants.GAS_PRICE,
      1000,
    );
  });

  const results = await Promise.all(promises);

  const transformed = results.map((result) => transformModulesRequest(result));
  const flattened = transformed.flat();
  const sorted = flattened.sort((a, b) => {
    if (a.moduleName === b.moduleName) {
      return parseInt(a.chainId, 10) - parseInt(b.chainId, 10);
    }
    return a.moduleName.localeCompare(b.moduleName);
  });

  return sorted;
};

const getQueryValue = (
  needle: string,
  haystack: ParsedUrlQuery,
  validator?: (value: string) => boolean,
): string | undefined => {
  if (typeof haystack[needle] === 'undefined') {
    return undefined;
  }

  const value = Array.isArray(haystack[needle])
    ? (haystack[needle]![0] as string)
    : (haystack[needle] as string);

  if (validator) {
    return validator(value) ? value : undefined;
  }

  return value;
};

const QueryParams = {
  MODULE: 'module',
  CHAIN: 'chain',
};

export const getServerSideProps: GetServerSideProps<{
  data: IModule[];
  prefetchedModule: (IModule & { code: string }) | null;
}> = async (context) => {
  // TODO: Tidy this up
  const network: Network =
    parse(
      context.req.cookies[encodeURIComponent(getName(StorageKeys.NETWORK))] ||
        '',
    ) || DefaultValues.NETWORK;

  const modules = await getModules(network);

  let prefetchedModule = null;
  const moduleQueryValue = getQueryValue(QueryParams.MODULE, context.query);
  const chainQueryValue = getQueryValue(
    QueryParams.CHAIN,
    context.query,
    (value) => CHAINS.includes(value as ChainwebChainId),
  );
  if (moduleQueryValue && chainQueryValue) {
    const moduleResponse = await describeModule(
      moduleQueryValue,
      chainQueryValue as ChainwebChainId,
      network,
      kadenaConstants.DEFAULT_SENDER,
      kadenaConstants.GAS_PRICE,
      1000,
    );

    if (moduleResponse.result.status !== 'failure') {
      prefetchedModule = {
        code: (moduleResponse.result.data as unknown as { code: string }).code,
        moduleName: moduleQueryValue,
        chainId: chainQueryValue,
      } as IModule & { code: string };
    }
  }

  return {
    props: {
      data: modules,
      prefetchedModule,
    },
  };
};

const NewPage = ({
  data,
  prefetchedModule,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const onChange = (e) => {
    setText(e.target.value);
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };

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

  const [chainID, setChainID] = useState<ChainwebChainId | ''>('');

  const [selectedModule, setSelectedModule] = useState<IModule | null>(
    prefetchedModule,
  );
  const { selectedNetwork: network } = useWalletConnectClient();

  const {
    isLoading: areModulesLoading,
    error: modulesError,
    data: modules,
  } = useQuery({
    queryKey: ['modules', network],
    queryFn: () => getModules(network),
    initialData: data,
  });

  const {
    isLoading: isModuleLoading,
    error: moduleError,
    data: moduleCode,
  } = useQuery({
    queryKey: ['module', selectedModule, network],
    queryFn: async () => {
      const result = await describeModule(
        selectedModule!.moduleName,
        selectedModule!.chainId,
        network,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );

      if (result.result.status === 'failure') {
        throw new Error('Something went wrong');
      }

      return (result.result.data as unknown as { code: string }).code;
    },
    enabled: !!selectedModule,
    initialData: prefetchedModule?.code,
  });

  const router = useRouter();

  const onModuleClick = useCallback<(selectedModule: IModule) => void>(
    (selectedModule) => {
      setSelectedModule(selectedModule);
      // eslint-disable-next-line no-void
      void router.replace(
        `?${QueryParams.MODULE}=${selectedModule.moduleName}&${QueryParams.CHAIN}=${selectedModule.chainId}`,
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Module Explorer')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Grid.Root columns={2}>
        <Grid.Item>
          <Card fullWidth>
            <Heading as="h4">
              {selectedModule ? selectedModule.moduleName : 'Select a module'}
              {selectedModule ? (
                <Box display={'inline-block'}>
                  <SystemIcon.Link display={'inline-block'} />
                </Box>
              ) : null}
              {selectedModule ? selectedModule.chainId : null}
            </Heading>
            <AceViewer code={moduleCode} />
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card fullWidth>
            <Grid.Root columns={2}>
              <Grid.Item>
                <TextField
                  label="Search"
                  inputProps={{
                    id: 'something',
                    placeholder: 'Module name',
                    onChange,
                    value: text,
                  }}
                />
              </Grid.Item>
              <Grid.Item>
                <ChainSelect
                  includeEmpty
                  onChange={(value) => setChainID(value)}
                  value={chainID}
                  ariaLabel="Select Chain ID"
                />
              </Grid.Item>
            </Grid.Root>
            {isPending && <Text>Loading...</Text>}
            <ModulesTable
              modules={modules}
              searchQuery={searchQuery}
              chainID={chainID}
              onModuleClick={onModuleClick}
            />
          </Card>
        </Grid.Item>
      </Grid.Root>
    </>
  );
};

export default NewPage;
