import dotenv from 'dotenv';
dotenv.config();
export const channelId = process.env.SLACK_CHANNELID;
export const tokenId = process.env.SLACK_TOKEN;
export const faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
export const MINBALANCE = 1000;

//graph
export const MAXBLOCKHEIGHT_DIFFERENCE = 1;

export interface IChainAccount {
  balance: number;
  chainId: string;
}

export interface IAccount {
  data?: {
    fungibleAccount: {
      chainAccounts: IChainAccount[];
    };
  };
  errors?: { message: string }[];
}
