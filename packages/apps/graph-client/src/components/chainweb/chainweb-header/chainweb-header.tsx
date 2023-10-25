import { Box } from '@/components/box';
import { Text } from '@/components/text';
import { selectColor } from '@/utils/selectColor';
import React from 'react';

export const ChainwebHeader = (): JSX.Element => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box css={{ width: '$blockWidth', mx: '$1' }} />
      {[...new Array(20)].map((__, index) => (
        <Text
          key={`chainweb_header_${index}`}
          as="span"
          css={{
            fontWeight: '$bold',
            width: '$blockWidth',
            height: '$blockWidth',
            fontSize: '$sm',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: '$1',
            mx: '$1',
            my: '$1',
            color: selectColor(index, 11),
            '&::after': {
              content: '',
              position: 'absolute',
              right: '$3',
              left: '$3',
              bottom: 0,
              height: 1,
              background: selectColor(index, 11),
            },
          }}
        >
          {index}
        </Text>
      ))}
    </Box>
  );
};
