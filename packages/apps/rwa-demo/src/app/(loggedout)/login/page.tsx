'use client';
import { useAccount } from '@/hooks/account';
import { Button } from '@kadena/kode-ui';

const Home = () => {
  const { login, accounts, selectAccount } = useAccount();
  const handleConnect = async () => {
    await login();
  };

  return (
    <div>
      <Button onPress={handleConnect}>Connect</Button>

      {accounts && accounts.length > 1 && (
        <ul>
          {accounts.map((account) => (
            <li key={account.address}>
              <Button onPress={() => selectAccount(account)}>
                {account.alias}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
