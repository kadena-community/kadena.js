import { Heading, Text } from '@kadena/react-ui';

import React from 'react';

interface IOutlineProps extends React.HTMLAttributes<HTMLDivElement> {}

const Outline = (props: IOutlineProps): React.JSX.Element => {
  return (
    <div {...props}>
      <Heading as="h4">Outline</Heading>
      <Text>To be implemented…</Text>
    </div>
  );
};

export default Outline;
