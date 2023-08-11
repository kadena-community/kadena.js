import { container, header, main, panel } from './Home.css';

import { FC } from 'react';
import { Connect, ConnectDebug } from '@/components/Connect/Connect';
import { Accounts } from '@/components/Accounts/Accounts';

export const Home: FC = () => {
  return (
    <div className={container}>
      <header className={header}>
        <h3>Immutable records</h3>
      </header>
      <main className={main}>
        <div className={panel}>
          <Connect />
          <ConnectDebug />
        </div>
        <div className={panel}>
          <Accounts />
        </div>
      </main>
    </div>
  );
};
