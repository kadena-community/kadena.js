import { useSocket } from '@/hooks/socket';
import type { FC } from 'react';

export const ListSubscribers: FC = () => {
  const { proofOfUs } = useSocket();

  return (
    <section>
      <h3>Subscribers</h3>
      <ul>
        {proofOfUs?.signees.map((signee) => (
          <li key={signee.key}>{signee.name}</li>
        ))}
      </ul>
    </section>
  );
};
