import { Text, TextField } from '@kadena/react-ui';

import type { IModule } from '..';

import Outline from './outline';
import type { IResultsProps } from './results';
import Results from './results';
import {
  containerStyle,
  modulesContainerStyle,
  outlineStyle,
} from './styles.css';

import React, { useState, useTransition } from 'react';

export interface ISidePanelProps {
  results: IResultsProps['data'];
  onResultClick: IResultsProps['onItemClick'];
  selectedModule?: IModule & { code: string };
}

const SidePanel = ({
  results,
  onResultClick,
  selectedModule,
}: ISidePanelProps): React.JSX.Element => {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>();
  const [isPending, startTransition] = useTransition();

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
          inputProps={{
            id: 'something',
            placeholder: 'Module name',
            onChange,
            value: text,
          }}
        />
      </div>
      {isPending && <Text>Loading...</Text>}
      <Results
        data={results}
        filter={searchQuery}
        onItemClick={onResultClick}
        className={modulesContainerStyle}
      />
      <Outline selectedModule={selectedModule} className={outlineStyle} />
    </div>
  );
};

export default SidePanel;
