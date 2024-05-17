import { MonoSearch } from '@kadena/react-icons/system';
import { Box, Button, TextField } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useState } from 'react';

const searchItems = [
  { title: 'Account', description: 'k:81b8....1269a97' },
  { title: 'Request Key', description: 'DAbe...4d3E' },
  { title: 'Block', description: '0x1a' },
];
const placeholderText = 'Search the Kadena Blockchain on';

const SearchCombobox: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [option, setOption] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <>
      <Box
        paddingInline={'xxl'}
        minWidth={'content.minWidth'}
        display={'flex'}
        flexDirection={'column'}
        // onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            console.log('key down');
            setSelectedRow((prev) =>
              prev === null ? 0 : Math.min(prev + 1, searchItems.length - 1),
            );
          } else if (e.key === 'ArrowUp') {
            setSelectedRow((prev) =>
              prev === null ? 0 : Math.max(prev - 1, 0),
            );
          }
          // else if (e.key === 'Enter') {
          //   setOption(searchItems[selectedRow ?? 0].title);
          //   // setIsEditing(false);
          // }
        }}
      >
        <Box
          display={'inline-flex'}
          flexDirection={'row'}
          alignItems={'center'}
        >
          <MonoSearch />
          <TextField
            size="md"
            placeholder={placeholderText}

            // onFocus={() => setIsEditing(true)}
          ></TextField>
        </Box>

        {isEditing && (
          <div
            className={atoms({
              display: 'grid',
              borderStyle: 'solid',
              borderWidth: 'hairline',
              backgroundColor: 'base.@active',
              fontSize: 'xs',
            })}
          >
            {searchItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedRow(index)}
                // onFocus={() => setIsEditing(true)}
                className={atoms({
                  alignItems: 'flex-start',
                  paddingInlineStart: 'md',
                  cursor: 'pointer',
                  backgroundColor:
                    index === selectedRow
                      ? 'accent.primary.inverse.@active'
                      : 'base.@active',
                })}
              >
                <div
                  className={atoms({
                    alignItems: 'flex-start',
                  })}
                >
                  {item.title}
                </div>
                <div
                  className={atoms({
                    alignItems: 'flex-end',
                  })}
                >
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </Box>
    </>
  );
};

export default SearchCombobox;
