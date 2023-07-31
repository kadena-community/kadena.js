import { container } from './Home.css';

import { FC } from 'react';
import { Connect } from '@/components/Connect';

export const Home: FC = () => {
  return (
    <div className={container}>
      <div>hello world</div>
      <Connect />
    </div>
  );
};
