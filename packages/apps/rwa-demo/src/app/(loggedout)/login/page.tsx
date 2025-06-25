'use client';
import { Card } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';

import { LoginForm } from '@/components/LoginForm/LoginForm';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock title="Login">
        <LoginForm />
      </CardContentBlock>
    </Card>
  );
};

export default Home;
