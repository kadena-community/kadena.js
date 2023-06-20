export interface EnvInterface {
  KADENA_API_TTIL?: number;
  KADENA_MAINNET_API?: string;
  KADENA_TESTNET_API?: string;
  GAS_LIMIT?: number;
}

export const dotenv: EnvInterface = {
  KADENA_API_TTIL: Number(process.env.KADENA_API_TTIL),
  KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
  KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
  GAS_LIMIT: Number(process.env.GAS_LIMIT),
};

export const env = (
  key: keyof EnvInterface,
  defaultValue: any = undefined,
): any => dotenv[key] ?? defaultValue;
