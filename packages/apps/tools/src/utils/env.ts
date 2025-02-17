export interface IEnvInterface {
  KADENA_API_TTIL?: number;
  KADENA_MAINNET_API?: string;
  KADENA_TESTNET_API?: string;
  KADENA_MAINNET_ESTATS?: string;
  KADENA_TESTNET_ESTATS?: string;
  GAS_LIMIT?: number;
  GAS_PRICE?: number;
  DEFAULT_SENDER?: string;
  WALLET_CONNECT_PROJECT_ID?: string;
  WALLET_CONNECT_RELAY_URL?: string;
  FAUCET_NAMESPACE?: string;
  FAUCET_CONTRACT?: string;
  FAUCET_USER?: string;
  QA_LEDGER_MOCK?: string;
  QA_LEDGER_MOCKED_PUBKEY?: string;
  QA_LEDGER_MOCKED_PRIVATEKEY?: string;
}

type RequiredEnv = Required<IEnvInterface>;

export const dotenv: IEnvInterface = {
  KADENA_API_TTIL: Number(process.env.KADENA_API_TTIL),
  KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
  KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
  KADENA_MAINNET_ESTATS: process.env.KADENA_MAINNET_ESTATS,
  KADENA_TESTNET_ESTATS: process.env.KADENA_TESTNET_ESTATS,
  GAS_LIMIT: Number(process.env.GAS_LIMIT),
  GAS_PRICE: Number(process.env.GAS_PRICE),
  DEFAULT_SENDER: process.env.DEFAULT_SENDER,
  WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  WALLET_CONNECT_RELAY_URL: process.env.WALLET_CONNECT_RELAY_URL,
  FAUCET_NAMESPACE: process.env.FAUCET_NAMESPACE,
  FAUCET_CONTRACT: process.env.FAUCET_CONTRACT,
  FAUCET_USER: process.env.FAUCET_USER,
  QA_LEDGER_MOCK: process.env.QA_LEDGER_MOCK,
  QA_LEDGER_MOCKED_PUBKEY: process.env.QA_LEDGER_MOCKED_PUBKEY,
  QA_LEDGER_MOCKED_PRIVATEKEY: process.env.QA_LEDGER_MOCKED_PRIVATEKEY,
};

export const env = <T extends keyof RequiredEnv, TDefault>(
  key: T,
  defaultValue: TDefault,
): TDefault | NonNullable<RequiredEnv[T]> => {
  const falsyKey =
    (typeof dotenv[key] === 'number' && isNaN(Number(dotenv[key]))) ||
    dotenv[key] === null ||
    dotenv[key] === undefined ||
    dotenv[key] === '';

  return falsyKey
    ? (defaultValue as TDefault)
    : (dotenv[key] as NonNullable<RequiredEnv[T]>);
};
