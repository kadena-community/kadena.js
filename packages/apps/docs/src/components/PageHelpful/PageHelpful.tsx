import { IconButton, Stack, Text } from '@kadena/react-ui';

import usePageHelpful from './usePageHelpful';

import React, { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const PageHelpful: FC<IProps> = ({ editLink }) => {
  const { handlePageHelpful, handlePageNotHelpful } = usePageHelpful(editLink);

  return (
    <Stack direction="column" gap="$xs">
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
    </Stack>
  );
};
