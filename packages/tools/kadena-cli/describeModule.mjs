import { describeModule } from '@kadena/client-utils/built-in';

export default async function main() {
  const module = await describeModule(
    'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
    {
      host: 'https://api.testnet.chainweb.com',
      defaults: {
        networkId: 'testnet04',
        meta: {
          chainId: '19',
        }
      }
    }
  );
  console.log(module);
}

main();
