import { Button } from '@kadena/react-components';

import { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const EditPage: FC<IProps> = ({ editLink }) => {
  if (Boolean(editLink) === null) return null;
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
