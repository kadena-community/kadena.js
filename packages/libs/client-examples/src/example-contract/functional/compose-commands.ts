import { IPactCommand, Pact } from '@kadena/client';
import {
  addSigner,
  createPactCommand,
  payload,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

// you can compose command by using the createPactCommand util
export function composeCommands(): Partial<IPactCommand> {
  const mainnetConfig = createPactCommand(
    setMeta({ chainId: '1' }),
    setNetworkId('mainnet04'),
  );

  const transfer = createPactCommand(
    payload.exec(
      Pact.modules.coin.transfer('javad', 'albert', { decimal: '0.1' }),
    ),
    addSigner('javadPublicKey', (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
    ]),
  );

  return createPactCommand(mainnetConfig, transfer)();
}
