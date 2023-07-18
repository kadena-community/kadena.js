import { TextField } from '@kadena/react-ui';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { StyledOption } from '@/components/Global/Select/styles';
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

import { Select } from '@/components/Global';
import { kadenaConstants } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  type IModuleResult,
  describeModule,
} from '@/services/modules/describe-module';
import {
  type IModulesResult,
  listModules,
} from '@/services/modules/list-module';
import { convertIntToChainId } from '@/services/utils/utils';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';

const ModuleExplorer: FC = () => {
  Debug('kadena-transfer:pages:transfer:module-explorer');
  const { t } = useTranslation('common');
  const [moduleName, setModuleName] = useState<string>('');
  const [moduleSearch, setModuleSearch] = useState<string>('');
  const [moduleChain, setModuleChain] = useState<number>(1);
  const [modules, setModules] = useState<IModulesResult>({});
  const [results, setResults] = useState<IModuleResult>({});

  const { network } = useAppContext();
  const numberOfChains = 20;

  useEffect(() => {
    const fetchModules = async (): Promise<void> => {
      const modules = await listModules(
        convertIntToChainId(moduleChain),
        network,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );
      setModules(modules);
    };

    fetchModules().catch(console.error);
  }, [moduleChain, network]);

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
        convertIntToChainId(moduleChain),
        network,
        kadenaConstants.DEFAULT_SENDER,
        kadenaConstants.GAS_PRICE,
        1000,
      );

      setResults(data);
    };

    fetchModule().catch(console.error);
  }, [moduleChain, moduleName, network]);

  const renderChainOptions = (): JSX.Element[] => {
    const options = [];
    for (let i = 0; i < numberOfChains; i++) {
      options.push(
        <StyledOption value={i} key={i}>
          {i}
        </StyledOption>,
      );
    }
    return options;
  };

  return (
    <MainLayout
      title={t('Kadena Module Explorer')}
      footer={
        <>
          {Boolean(results.code) && (
            <StyledResultContainer>
              <StyledCodeViewerContainer>
                <AceViewer code={results.code} />
              </StyledCodeViewerContainer>
            </StyledResultContainer>
          )}
        </>
      }
    >
      <StyledForm>
        <StyledAccountForm>
          <Select
            label={t('Select the module chain')}
            leadingText={t('Chain')}
            onChange={(e) => setModuleChain(parseInt(e.target.value))}
            value={moduleChain}
          >
            {renderChainOptions()}
          </Select>
          <TextField
            label={t('Module Name')}
            inputProps={{
              id: 'module-name-input',
              placeholder: t('Enter desired module name'),
              onChange: (e: any) =>
                setModuleSearch((e.target as HTMLInputElement).value),
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
    </MainLayout>
  );
};

export default ModuleExplorer;
