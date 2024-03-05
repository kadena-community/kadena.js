// import { createTokenId } from '@kadena/client-utils/marmalade';
// import type { Command } from 'commander';
// import { createCommand } from '../../utils/createCommand.js';
// import { globalOptions } from '../../utils/globalOptions.js';

// export const mintCommand: (program: Command, version: string) => void =
//   createCommand(
//     'mint',
//     'mint a new NFT on Marmalade',
//     [globalOptions.network()],
//     async (config) => {
//       log.debug('marmalade-mint:action', { config });
//       const tokenIdReponse = createTokenId(
//         {
//           account: {
//             account: '123',
//             publicKeys: [],
//           },
//           gasPayer: {
//             account: '123',
//             publicKeys: [],
//           },
//           chainId: '1',
//           uri: 'https://example.com',
//           policies: [],
//           creationGuard: {
//             keys: [],
//             pred: 'keys-all',
//           },
//         },
//         {
//           host: config.networkConfig.networkHost,
//           defaults: {
//             networkId: config.networkConfig.networkId,
//           },
//         },
//       );

//       const tokenId = await tokenIdReponse.execute();
//       console.log(tokenId);
//       // mintNFT
//     },
//   );
