import type { ChainId } from '@kadena/types';
import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAINWEB_NODE_RETRY_ATTEMPTS: number;
  CHAINWEB_NODE_RETRY_DELAY: number;
  COMPLEXITY_ENABLED: boolean;
  COMPLEXITY_EXPOSED: boolean;
  COMPLEXITY_LIMIT: number;
  DATABASE_URL: string;
  DEFAULT_FUNGIBLE_NAME: string;
  GITHUB_TOKEN: string | undefined;
  MARMALADE_ENABLED: boolean;
  MARMALADE_REMOTE_EXCLUDE: string[];
  MARMALADE_REMOTE_NAMESPACE_PATH: string[];
  MARMALADE_REMOTE_TEMPLATE_PATH: string;
  MARMALADE_REPOSITORY_BRANCH: string;
  MARMALADE_REPOSITORY_NAME: string;
  MARMALADE_REPOSITORY_OWNER: string;
  MARMALADE_LOCAL_NAMESPACE_PATH: string;
  MARMALADE_LOCAL_TEMPLATE_PATH: string;
  MEMPOOL_HOST: string;
  NETWORK_HOST: string;
  NETWORK_STATISTICS_URL: string;
  NODE_ENV: string;
  PORT: number;
  PRISMA_LOGGING_ENABLED: boolean;
  PRISMA_LOG_TO_FILE: boolean;
  PRISMA_LOG_FILENAME: string;
  TRACING_ENABLED: boolean;
  TRACING_EXPOSED: boolean;
  TRACING_LOG_FILENAME: string;
  SIMULATE_DEFAULT_CHAIN_ID: ChainId;
  SIMULATE_LOG_FOLDER_NAME: string;
  TIMEOUT_PACT_QUERY: number;
} = {
  CHAINWEB_NODE_RETRY_ATTEMPTS: parseInt(
    or(process.env.CHAINWEB_NODE_RETRY_ATTEMPTS, '5'),
    10,
  ),
  CHAINWEB_NODE_RETRY_DELAY: parseInt(
    or(process.env.CHAINWEB_NODE_RETRY_DELAY, '100'),
    10,
  ),
  COMPLEXITY_ENABLED: or(
    process.env.COMPLEXITY_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  COMPLEXITY_EXPOSED: or(
    process.env.COMPLEXITY_EXPOSED?.toLocaleLowerCase() === 'true',
    false,
  ),
  COMPLEXITY_LIMIT: parseInt(or(process.env.COMPLEXITY_LIMIT, '500'), 10),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet?pool_timeout=0',
  ),
  DEFAULT_FUNGIBLE_NAME: or(process.env.DEFAULT_FUNGIBLE_NAME, 'coin'),
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  MARMALADE_ENABLED: or(
    process.env.MARMALADE_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  MARMALADE_LOCAL_NAMESPACE_PATH: or(
    process.env.MARMALADE_LOCAL_NAMESPACE_PATH,
    'src/devnet/deployment/marmalade/templates/ns',
  ),
  MARMALADE_LOCAL_TEMPLATE_PATH: or(
    process.env.MARMALADE_LOCAL_TEMPLATE_PATH,
    'src/devnet/deployment/marmalade/templates/v2',
  ),
  MARMALADE_REMOTE_EXCLUDE: or(
    process.env.MARMALADE_REMOTE_EXCLUDE?.split(','),
    ['sample', 'data'],
  ),
  MARMALADE_REMOTE_NAMESPACE_PATH: or(
    process.env.MARMALADE_REMOTE_NAMESPACE_PATH?.split(','),
    ['pact/marmalade-ns', 'pact/util'],
  ),
  MARMALADE_REMOTE_TEMPLATE_PATH: or(
    process.env.MARMALADE_REMOTE_TEMPLATE_PATH,
    'pact/yaml',
  ),
  MARMALADE_REPOSITORY_BRANCH: or(
    process.env.MARMALADE_REPOSITORY_BRANCH,
    'main',
  ),
  MARMALADE_REPOSITORY_NAME: or(
    process.env.MARMALADE_REPOSITORY_NAME,
    'marmalade',
  ),
  MARMALADE_REPOSITORY_OWNER: or(
    process.env.MARMALADE_REPOSITORY_OWNER,
    'kadena-io',
  ),
  MEMPOOL_HOST: or(process.env.MEMPOOL_HOST, 'localhost:1789'),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'http://localhost:8080'),
  NETWORK_STATISTICS_URL: or(
    process.env.NETWORK_STATISTICS_URL,
    'http://localhost:8080/stats',
  ),
  NODE_ENV: or(process.env.NODE_ENV, 'production'),
  PORT: parseInt(or(process.env.PORT, '4000'), 10),
  PRISMA_LOGGING_ENABLED: or(
    process.env.PRISMA_LOGGING_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  PRISMA_LOG_TO_FILE: or(
    process.env.PRISMA_LOG_TO_FILE?.toLocaleLowerCase() === 'true',
    false,
  ),
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
  SIMULATE_DEFAULT_CHAIN_ID: or(
    process.env.SIMULATE_DEFAULT_CHAIN_ID as ChainId,
    '0' as ChainId,
  ),
  SIMULATE_LOG_FOLDER_NAME: or(process.env.SIMULATE_LOG_FOLDER_NAME, 'logs'),
  TIMEOUT_PACT_QUERY: parseInt(or(process.env.TIMEOUT_PACT_QUERY, '5000'), 10),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
