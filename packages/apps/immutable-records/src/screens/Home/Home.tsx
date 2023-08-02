import { container } from './Home.css';

import { FC } from 'react';
import { Connect } from '@/components/Connect';
import { Accounts } from '@/components/Accounts';

export const Home: FC = () => {
  return (
    <div className={container}>
      <div>hello world</div>
      <Connect />
      <Accounts />
    </div>
  );
};
