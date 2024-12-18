import { execFileSync } from 'child_process';

// https://github.com/azhar22k/ourl/tree/main

const commands = (): [string] | [string, string[]] => {
  const { platform } = process;
  switch (platform) {
    case 'android':
    case 'linux':
      return ['xdg-open'];
    case 'darwin':
      return ['open'];
    case 'win32':
      return ['cmd', ['/c', 'start']];
    default:
      throw new Error(`Platform ${platform} isn't supported.`);
  }
};

export const openBrowser = (url: string) => {
  const [command, args = []] = commands();
  execFileSync(command, [...args, encodeURI(url)]);
};
