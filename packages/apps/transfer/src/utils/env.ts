export interface IEnvInterface {
  KADENA_API_TTIL?: number;
  KADENA_MAINNET_API?: string;
  KADENA_TESTNET_API?: string;
  GAS_LIMIT?: number;
  FAUCET_PUBLIC_KEY?: string;
  FAUCET_PRIVATE_KEY?: string;
}

export const dotenv: IEnvInterface = {
  KADENA_API_TTIL: Number(process.env.KADENA_API_TTIL),
  KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
  KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
  GAS_LIMIT: Number(process.env.GAS_LIMIT),
  FAUCET_PUBLIC_KEY: process.env.FAUCET_PUBLIC_KEY,
  FAUCET_PRIVATE_KEY: process.env.FAUCET_PRIVATE_KEY,
};

export const env = <T extends keyof IEnvInterface, TDefault>(
  key: T,
  defaultValue: TDefault,
): TDefault | NonNullable<IEnvInterface[T]> => dotenv[key] ?? defaultValue;
