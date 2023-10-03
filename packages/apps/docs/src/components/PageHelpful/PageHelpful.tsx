import { IconButton, Stack, Text } from '@kadena/react-ui';

import usePageHelpful from './usePageHelpful';

import type { FC } from 'react';
import React from 'react';

interface IProps {
  editLink?: string;
}

export const PageHelpful: FC<IProps> = ({ editLink }) => {
  const { handlePageHelpful, handlePageNotHelpful, isPageHelpful } =
    usePageHelpful(editLink);

  return (
    <>
      <Stack direction="column" gap="$sm">
        <Text bold as="p">
          Was this page helpful?
        </Text>
        <Stack gap="$xs">
          <IconButton
            color="positive"
            icon="ThumbUpOutline"
            onClick={handlePageHelpful}
            title="Useful"
            variant="alternative"
            active={isPageHelpful === 'up'}
          />
          <IconButton
            color="negative"
            icon="ThumbDownOutline"
            onClick={handlePageNotHelpful}
            title="Not useful"
            variant="alternative"
            active={isPageHelpful === 'down'}
          />
        </Stack>
      </Stack>
    </>
  );
};
