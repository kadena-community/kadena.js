'use client';
import { useUser } from '@/hooks/user';
import { Button, Card } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  const { signOut } = useUser();

  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock title="404">
        <Button onClick={signOut}>Sign out</Button>
      </CardContentBlock>
    </Card>
  );
};

export default Home;
