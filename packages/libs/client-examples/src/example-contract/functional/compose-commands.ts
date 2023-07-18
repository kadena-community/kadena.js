import { IPactCommand, Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  payload,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

// you can compose command by using the createPactCommand util
export function composeCommands(): Partial<IPactCommand> {
  const mainnetConfig = composePactCommand(
    setMeta({ chainId: '1' }),
    setNetworkId('mainnet04'),
  );

  const transfer = composePactCommand(
    payload.exec(
      Pact.modules.coin.transfer('javad', 'albert', { decimal: '0.1' }),
    ),
    addSigner('javadPublicKey', (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
    ]),
  );

  return composePactCommand(mainnetConfig, transfer)();
}
