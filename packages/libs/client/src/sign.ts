import { IPactCommand } from './interfaces/IPactCommand';
import { isCommand } from './utils/isCommand';

/**
 * quicksign send the command to the wallet to be signed.
 * @param command the command as string to be signed
 * @param otherSignatures map of the available signatures, in case if a multi-sig transaction already signed by some of the signers
 * @returns
 */
export const quicksign = (
  command: string | IPactCommand,
  otherSignatures: Record<string, string> = {},
): Promise<{ cmd: string; sigs: string[] }> => {
  const commandJSon: Partial<IPactCommand> =
    typeof command === 'string' ? JSON.parse(command) : command;
  const commandStr =
    typeof command === 'string' ? command : JSON.stringify(command);

  if (isCommand(commandJSon)) {
    const request = {
      cmd: commandStr,
      sigs: commandJSon.signers.map((signer, i) => ({
        pubKey: signer.pubKey,
        sig: otherSignatures[signer.pubKey] ?? null,
      })),
    };

    console.log('quicksign request', request);

    // TODO: implement the quicksign request
    return Promise.resolve({
      cmd: commandStr,
      sigs: [
        ...commandJSon.signers.map(({ pubKey }) => pubKey),
        ...Object.values(otherSignatures),
      ],
    });
  }
  return Promise.reject(new Error('INVALID_COMMAND'));
};
