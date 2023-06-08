import { Button } from '@kadena/react-components';

import { FC } from 'react';

interface IProps {
  filename?: string;
}

const editRoot = process.env.NEXT_PUBLIC_GIT_EDIT_ROOT;

export const EditPage: FC<IProps> = ({ filename }) => {
  if (editRoot === null || filename === null) return null;
  return (
    <a href={`${editRoot}${filename}`} target="_blank" rel="noreferrer">
      <Button title="Edit this page">Edit this page</Button>
    </a>
  );
};
