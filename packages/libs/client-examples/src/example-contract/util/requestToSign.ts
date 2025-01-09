import type { ICommand, IUnsignedCommand } from '@kadena/types';

const browserPrompt = async (command: string) => {
  await window.navigator.clipboard.writeText(command);
  return Promise.resolve(
    window.prompt(
      `Command:\n${command}\nCommand copied to the clipboard\nEnter Signature:\n)`,
    ) ?? '',
  );
};

const nodePrompt = async (command: string) => {
  const message = `Command:\n${command}\nEnter Signature:\n`;
  const readline = await import('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

export function createRequestToSign(
  prompt: (message: string) => Promise<string> = typeof window !== 'undefined'
    ? browserPrompt
    : nodePrompt,
) {
  return async (command: IUnsignedCommand): Promise<ICommand> => {
    const sig = await prompt(JSON.stringify(command, null, 2));
    return {
      ...command,
      sigs: [{ sig }],
    };
  };
}
