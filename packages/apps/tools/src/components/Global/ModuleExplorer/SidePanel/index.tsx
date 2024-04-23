import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { Text, TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import React, { useState, useTransition } from 'react';
import type { IChainModule } from '../types';
import type { IOutlineProps } from './outline';
import Outline from './outline';
import type { IResultsProps } from './results';
import Results from './results';
import {
  containerStyle,
  modulesContainerStyle,
  outlineStyle,
} from './styles.css';

export interface ISidePanelProps {
  results: IResultsProps['data'];
  onResultClick: IResultsProps['onItemClick'];
  onModuleExpand: IResultsProps['onModuleExpand'];
  onInterfaceClick: IOutlineProps['onInterfaceClick'];
  onInterfacesExpand: IOutlineProps['onInterfacesExpand'];
  selectedModule?: IChainModule;
}

const SidePanel = ({
  results,
  onResultClick,
  onInterfaceClick,
  onInterfacesExpand,
  onModuleExpand,
  selectedModule,
}: ISidePanelProps): React.JSX.Element => {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('common');
  const { selectedNetwork } = useWalletConnectClient();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };

  return (
    <div className={containerStyle}>
      <div>
        <TextField
          label="Search"
          id="module-explorer-search"
          placeholder={t('Module name')}
          onChange={onChange}
          value={text}
        />
      </div>
      {isPending && <Text>Loading...</Text>}
      <Results
        key={`results-${selectedNetwork}`}
        data={results}
        filter={searchQuery}
        onItemClick={onResultClick}
        onModuleExpand={onModuleExpand}
        className={modulesContainerStyle}
      />
      <Outline
        selectedModule={selectedModule}
        className={outlineStyle}
        onInterfaceClick={onInterfaceClick}
        onInterfacesExpand={onInterfacesExpand}
      />
    </div>
  );
};

export default SidePanel;
