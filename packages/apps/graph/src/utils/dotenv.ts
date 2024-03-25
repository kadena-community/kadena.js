import type { ChainId } from '@kadena/types';
import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  COMPLEXITY_LIMIT: number;
  COMPLEXITY_ENABLED: boolean;
  COMPLEXITY_EXPOSED: boolean;
  DATABASE_URL: string;
  DEFAULT_FUNGIBLE_NAME: string;
  NETWORK_HOST: string;
  NETWORK_ID: string;
  PORT: number;
  PRISMA_LOGGING_ENABLED: boolean;
  PRISMA_LOG_TO_FILE: boolean;
  PRISMA_LOG_FILENAME: string;
  TRACING_ENABLED: boolean;
  TRACING_EXPOSED: boolean;
  TRACING_LOG_FILENAME: string;
  MARMALADE_ENABLED: boolean;
  MARMALADE_REPOSITORY_OWNER: string;
  MARMALADE_REPOSITORY_NAME: string;
  MARMALADE_REPOSITORY_BRANCH: string;
  MARMALADE_REMOTE_TEMPLATE_PATH: string;
  MARMALADE_REMOTE_NAMESPACE_PATH: string[];
  MARMALADE_REMOTE_EXCLUDE: string[];
  MARMALADE_LOCAL_TEMPLATE_PATH: string;
  MARMALADE_LOCAL_NAMESPACE_PATH: string;
  MEMPOOL_HOSTNAME: string;
  MEMPOOL_PORT: number;
  GITHUB_TOKEN: string;
  SIMULATE_DEFAULT_CHAIN_ID: ChainId;
  SIMULATE_LOG_FOLDER_NAME: string;
  NODE_ENV: string;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  COMPLEXITY_LIMIT: parseInt(or(process.env.COMPLEXITY_LIMIT, '500'), 10),
  COMPLEXITY_ENABLED: or(
    process.env.COMPLEXITY_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  COMPLEXITY_EXPOSED: or(
    process.env.COMPLEXITY_EXPOSED?.toLocaleLowerCase() === 'true',
    false,
  ),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet?pool_timeout=0',
  ),
  DEFAULT_FUNGIBLE_NAME: or(process.env.DEFAULT_FUNGIBLE_NAME, 'coin'),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'http://localhost:8080'),
  NETWORK_ID: or(process.env.NETWORK_ID, 'development'),
  PORT: parseInt(or(process.env.PORT, '4000'), 10),
  PRISMA_LOGGING_ENABLED: true,
  PRISMA_LOG_TO_FILE: true,
  PRISMA_LOG_FILENAME: or(process.env.PRISMA_LOG_FILENAME, 'prisma.log'),
  TRACING_ENABLED: or(
    process.env.TRACING_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  TRACING_EXPOSED: or(
    process.env.TRACING_EXPOSED?.toLocaleLowerCase() === 'true',
    false,
  ),
  TRACING_LOG_FILENAME: or(process.env.TRACING_LOG_FILENAME, 'traces.log'),
  MARMALADE_ENABLED: or(
    process.env.MARMALADE_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  MARMALADE_REPOSITORY_OWNER: or(
    process.env.MARMALADE_REPOSITORY_OWNER,
    'kadena-io',
  ),
  MARMALADE_REPOSITORY_NAME: or(
    process.env.MARMALADE_REPOSITORY_NAME,
    'marmalade',
  ),
  MARMALADE_REPOSITORY_BRANCH: or(
    process.env.MARMALADE_REPOSITORY_BRANCH,
    'main',
  ),
  MARMALADE_REMOTE_TEMPLATE_PATH: or(
    process.env.MARMALADE_REMOTE_TEMPLATE_PATH,
    'pact/yaml/marmalade-v2',
  ),
  MARMALADE_REMOTE_NAMESPACE_PATH: or(
    process.env.MARMALADE_REMOTE_NAMESPACE_PATH?.split(','),
    ['pact/marmalade-ns', 'pact/util'],
  ),

  MARMALADE_REMOTE_EXCLUDE: or(
    process.env.MARMALADE_REMOTE_EXCLUDE?.split(','),
    ['sample', 'data', 'test'],
  ),

  MARMALADE_LOCAL_TEMPLATE_PATH: or(
    process.env.MARMALADE_LOCAL_TEMPLATE_PATH,
    'src/devnet/deployment/marmalade/templates/v2',
  ),
  MARMALADE_LOCAL_NAMESPACE_PATH: or(
    process.env.MARMALADE_LOCAL_NAMESPACE_PATH,
    'src/devnet/deployment/marmalade/templates/ns',
  ),
  MEMPOOL_HOSTNAME: or(process.env.MEMPOOL_HOST, 'localhost'),
  MEMPOOL_PORT: parseInt(or(process.env.MEMPOOL_PORT, '1789'), 10),
  GITHUB_TOKEN: or(process.env.GITHUB_TOKEN, '/pact/marmalade-ns'),
  SIMULATE_DEFAULT_CHAIN_ID: or(
    process.env.SIMULATE_DEFAULT_CHAIN_ID as ChainId,
    '0' as ChainId,
  ),
  SIMULATE_LOG_FOLDER_NAME: or(process.env.SIMULATE_LOG_FOLDER_NAME, 'logs'),
  NODE_ENV: or(process.env.NODE_ENV, 'production'),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
