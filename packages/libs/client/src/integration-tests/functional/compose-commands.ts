import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '../../fp';
import { IPactCommand, Pact } from '../../index';

// you can compose command by using the createPactCommand util
export function composeCommands(): Partial<IPactCommand> {
  const mainnetConfig = composePactCommand(
    setMeta({ chainId: '1' }),
    setNetworkId('mainnet04'),
  );

  const transfer = composePactCommand(
    execution(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Pact.modules as any).coin.transfer('javad', 'albert', {
        decimal: '0.1',
      }),
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addSigner('javadPublicKey', (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
    ]),
  );

  return composePactCommand(mainnetConfig, transfer)();
}
