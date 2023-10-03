import { Text, TextField } from '@kadena/react-ui';

import Outline from './outline';
import type { IResultsProps } from './results';
import Results from './results';
import { containerStyle, modulesContainerStyle } from './styles.css';

import React, { useState, useTransition } from 'react';

export interface ISidePanelProps {
  results: IResultsProps['data'];
  onResultClick: IResultsProps['onItemClick'];
}

const SidePanel = ({
  results,
  onResultClick,
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
      <Outline style={{ minHeight: '10rem' }} />
    </div>
  );
};

export default SidePanel;
