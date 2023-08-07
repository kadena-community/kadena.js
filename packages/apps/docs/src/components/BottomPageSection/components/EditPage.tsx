import { Button } from '@kadena/react-ui';

import React, { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  if (!editLink) return null;
  return (
    <Button
      as="a"
      href={editLink}
      target="_blank"
      rel="noreferrer"
      title="Edit this page"
    >
      Edit this page
    </Button>
  );
};
