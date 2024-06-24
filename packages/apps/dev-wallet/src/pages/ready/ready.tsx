import { Heading } from '@kadena/react-ui';

export function Ready() {
  return (
    <main
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Heading>Dev Wallet is ready for connection</Heading>
    </main>
  );
}
