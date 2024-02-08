import { details } from '@kadena/client-utils/coin';

async function getAccountDetails(account, chainId) {
  // const result = await pipe(
  //   (name) => Pact.modules['coin']['details'](name),
  //   execution,
  //   dirtyReadClient({
  //     host: 'https://api.chainweb.com',
  //     defaults: {
  //       networkId: 'testnet04',
  //       meta: { chainId: '1' },
  //     },
  //   }),
  // )(account).execute();

  const result = await details(
    'mi_ca_new',
    'testnet04',
    '1',
    'https://api.testnet.chainweb.com',
    'n_3b878bdca18974c33dec88e791dd974107edc861.kdx',
  );


  console.log(result);
}

await getAccountDetails('mi_ca', '1');
