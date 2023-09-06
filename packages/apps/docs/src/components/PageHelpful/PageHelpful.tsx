import { IconButton, Stack, Text } from '@kadena/react-ui';

import usePageHelpful from './usePageHelpful';

import React, { FC } from 'react';

export const PageHelpful: FC = () => {
  const { handlePageHelpful, handlePageNotHelpful } = usePageHelpful();

  return (
    <div>
      <Text bold>Was this page helpful?</Text>
      <Stack gap="$xs">
        <IconButton
          color="positive"
          icon="ThumbUpOutline"
          onClick={handlePageHelpful}
          title="Useful"
        />
        <IconButton
          color="negative"
          icon="ThumbDownOutline"
          onClick={handlePageNotHelpful}
          title="Not useful"
        />
      </Stack>
    </div>
  );
};
