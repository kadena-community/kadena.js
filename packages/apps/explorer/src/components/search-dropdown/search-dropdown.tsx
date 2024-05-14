import { MonoSearch } from '@kadena/react-icons/system';
import { Combobox, ComboboxItem } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const SearchDropdown: React.FC = () => {
  return (
    <div
      className={atoms({
        display: 'flex',
      })}
    >
      <Combobox
        startVisual={<MonoSearch />}
        size="lg"
        placeholder="Search the Kadena Blockchain on"
      >
        <ComboboxItem textValue="sdsd">skjd</ComboboxItem>
      </Combobox>
    </div>
  );
};

export default SearchDropdown;
