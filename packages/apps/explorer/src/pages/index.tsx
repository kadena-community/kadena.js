import { useBlockQuery } from '@/__generated__/sdk';
import React from 'react';

const Home: React.FC = () => {
  const { data: block, error: blockError } = useBlockQuery({
    variables: {
      hash: 'KSngxzXprxY8SMrH0ABajE8cbOvy_yZVtLgNUkxC3pg',
    },
  });

  console.log(block, blockError);

  return (
    <>
      <p>K:Explorer</p>
    </>
  );
};

export default Home;
