'use client';
import { useUser } from '@/hooks/user';
import { Button, Card } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  const { signIn, user } = useUser();

  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock title="Login">
        <Button onPress={signIn}>sign in with google account</Button>

        <pre>{JSON.stringify(user, null, 2)}</pre>
      </CardContentBlock>
    </Card>
  );
};

export default Home;
