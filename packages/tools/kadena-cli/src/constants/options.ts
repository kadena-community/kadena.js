import { Option } from "commander";

export const account = new Option('-a, --account <account>', 'Receiver (k:) wallet address');

export const chainId = new Option('-c, --chainId <number>', 'Chain to retrieve from (default 1)')
  .argParser((value) => parseInt(value, 10));

export const network = new Option('-n, --network <network>', 'Kadena network (e.g. "mainnet")');

export const networkId = new Option('-nid, --networkId <networkId>', 'Kadena network Id (e.g. "mainnet01")');

export const networkHost = new Option('-h, --networkHost <networkHost>', 'Kadena network host (e.g. "https://api.chainweb.com")');

export const networkExplorerUrl = new Option('-e, --networkExplorerUrl <networkExplorerUrl>', 'Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")');
