import { Breadcrumbs, SystemIcon, TextField } from '@kadena/react-ui';

import dynamic from 'next/dynamic';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

import {
  StyledAccountForm,
  StyledCodeViewerContainer,
  StyledForm,
  StyledList,
  StyledListItem,
  StyledResultContainer,
} from './styles';

import { ChainSelect } from '@/components/Global';
import { kadenaConstants } from '@/constants/kadena';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import {
  type IModuleResult,
  describeModule,
} from '@/services/modules/describe-module';
import {
  type IModulesResult,
  listModules,
} from '@/services/modules/list-module';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, {
  ChangeEventHandler,
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ModuleExplorer: FC = () => {
  Debug('kadena-transfer:pages:transfer:module-explorer');
  const { t } = useTranslation('common');
  const [moduleName, setModuleName] = useState<string>('');
  const [moduleSearch, setModuleSearch] = useState<string>('');
  const [modules, setModules] = useState<IModulesResult>({});
  const [results, setResults] = useState<IModuleResult>({});

  const { network } = useAppContext();
  const [chainID, onChainSelectChange] = usePersistentChainID();

  useToolbar([
    {
      title: t('Cross Chain'),
      icon: SystemIcon.Transition,
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Finalize Cross Chain'),
      icon: SystemIcon.TransitionMasked,
      href: Routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      title: t('Module Explorer'),
      icon: SystemIcon.Earth,
      href: Routes.MODULE_EXPLORER,
    },
  ]);

  useEffect(() => {
    const fetchModules = async (): Promise<void> => {
      const modules = await listModules(
        chainID,
        network,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );
      setModules(modules);
    };

    fetchModules().catch(console.error);
  }, [chainID, network]);

  const filteredModules = useMemo(
    () =>
      (modules?.data || []).filter((module: string) =>
        module.includes(moduleSearch),
      ),
    [modules, moduleSearch],
  );

  useEffect(() => {
    if (!moduleName) {
      return;
    }

    const fetchModule = async (): Promise<void> => {
      const data = await describeModule(
        moduleName,
        chainID,
        network,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );

      setResults(data);
    };

    fetchModule().catch(console.error);
  }, [chainID, moduleName, network]);

  const onModuleNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setModuleSearch(e.target.value);
    },
    [],
  );

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Module Explorer')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <StyledForm>
        <StyledAccountForm>
          <ChainSelect
            onChange={onChainSelectChange}
            value={chainID}
            ariaLabel="Select Chain ID"
          />
          <TextField
            label={t('Module Name')}
            inputProps={{
              id: 'module-name-input',
              placeholder: t('Enter desired module name'),
              onChange: onModuleNameChange,
              value: moduleSearch,
            }}
          />
        </StyledAccountForm>
      </StyledForm>
      <StyledList>
        {!filteredModules?.length && t('No modules found.')}
        {filteredModules?.map((module) => (
          <StyledListItem
            key={module}
            data-module-name={module}
            onClick={(e: SyntheticEvent<HTMLDivElement>) =>
              setModuleName(e.currentTarget.dataset.moduleName || '')
            }
          >
            {module}
          </StyledListItem>
        ))}
      </StyledList>
      {Boolean(results.code) && (
        <StyledResultContainer>
          <StyledCodeViewerContainer>
            <AceViewer code={results.code} />
          </StyledCodeViewerContainer>
        </StyledResultContainer>
      )}
    </div>
  );
};

export default ModuleExplorer;
