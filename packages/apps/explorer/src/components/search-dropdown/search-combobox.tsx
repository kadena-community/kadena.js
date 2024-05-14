import { MonoSearch } from '@kadena/react-icons/system';
import { Box, Combobox, ComboboxItem, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const searchItems = [{ title: 'Account', description: 'asdjsjd' }];

const SearchCombobox: React.FC = () => {
  return (
    <div>
      <Combobox
        startVisual={<MonoSearch />}
        size="lg"
        placeholder="Search the Kadena Blockchain on"
      >
        {searchItems.map((item) => {
          return (
            <ComboboxItem>
              <Box display={'grid'}>
                <Text
                  bold
                  // className={atoms({
                  //   alignItems: 'flex-start',
                  // })}
                >
                  {item.title}
                </Text>
                <Text
                // className={atoms({
                //   alignItems: 'flex-end',
                // })}
                >
                  {item.description}
                </Text>
              </Box>
            </ComboboxItem>
          );
        })}
      </Combobox>
    </div>
  );
};

export default SearchCombobox;
