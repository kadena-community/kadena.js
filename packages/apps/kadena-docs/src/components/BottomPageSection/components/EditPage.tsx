import { Button } from '@kadena/react-components';

import { FC } from 'react';

interface IProps {
  filename?: string;
}

export const EditPage: FC<IProps> = ({ filename }) => {
  return (
    <a href="">
      <Button title="Edit this page">Edit this page</Button>
    </a>
  );
};
