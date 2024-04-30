import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { GasLimitEstimationError } from '@services/chainweb-node/estimate-gas-limit';
import { PactCommandError } from '@services/chainweb-node/utils';
import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { PrismaJsonColumnParsingError } from './prisma-json-columns';

/**
 * Checks what type of error it is and returns a normalized GraphQLError with the correct type, message and a description that clearly translates to the user what the error means.
 */
export function normalizeError(error: unknown): GraphQLError {
  if (error instanceof PrismaClientInitializationError) {
    return new GraphQLError('Prisma Client Initialization Error', {
      extensions: {
        type: error.name,
        message: error.message,
        description:
          'The Prisma client failed to initialize. Are you sure the database is running and reachable?',
        data: error.stack,
      },
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (
      error.message.includes(
        'Timed out fetching a new connection from the connection pool',
      )
    ) {
      return new GraphQLError('Prisma Client Connection Pool Timeout', {
        extensions: {
          type: error.name,
          message: 'Prisma Client Connection Pool Timeout',
          description:
            'The Prisma client failed to fetch a new connection from the connection pool. This is most likely due to the database being overloaded.',
          data: error.stack,
        },
      });
    }
    if (error.message.includes("Can't reach database server")) {
      return new GraphQLError('Prisma Client Database Connection Error', {
        extensions: {
          type: error.name,
          message: 'Prisma Client Database Connection Error',
          description:
            'The Prisma client was unable to reach the database. Check if your database is running and reachable.',
          data: error.stack,
        },
      });
    }
  }

  if (error instanceof PrismaClientValidationError) {
    let description: string | undefined;

    if (error.message.includes('Unknown argument')) {
      error.message = `Unknown argument${
        error.message.split('Unknown argument')[1]
      }`;

      description =
        'The Prisma client failed to validate the input. Check the input and try again. If you are trying to filter on a JSON column, make sure the JSON is in the correct format. See the README for the allowed JSON format.';
    }
    if (error.message.includes('Unknown field')) {
      description = `Prisma tried to select a field that is not available.`;
    }

    return new GraphQLError('Prisma Client Validation Error', {
      extensions: {
        type: error.name,
        message: error.message,
        description,
        data: error.stack,
      },
    });
  }

  if (error instanceof PrismaJsonColumnParsingError) {
    return new GraphQLError('Prisma JSON Column Parsing Error', {
      extensions: {
        type: error.name,
        message: error.message,
        description:
          'Error parsing JSON for filtering on the Prisma jsonb column. See the README for the allowed JSON format.',
        data: {
          query: error.query,
          subscription: error.subscription,
          queryParameter: error.queryParameter,
          column: error.column,
        },
      },
    });
  }

  if (error instanceof PactCommandError) {
    let description: string | undefined;

    if (error.pactError?.message.includes('with-read: row not found')) {
      description =
        'The requested resource (account, e.g.) was most likely not found.';
    } else if (error.pactError?.message.startsWith('Cannot resolve')) {
      description =
        'The requested module or function was most likely not found.';
    } else if (error.pactError?.message.includes('Failed reading: mzero')) {
      description =
        'Empty code was most likely sent to the Chainweb Node. Please check your arguments.';
    }

    return new GraphQLError('Chainweb Node Command Failure', {
      extensions: {
        type: error.pactError?.type || 'UnknownType',
        message: error.pactError?.message || error.message,
        description,
      },
    });
  }

  if (error instanceof GasLimitEstimationError) {
    return new GraphQLError('Gas Limit Estimation Error', {
      extensions: {
        type: error.name,
        message: error.originalError?.message || error.message,
        description: error.message.startsWith(
          'Chainweb Node was unable to estimate',
        )
          ? error.message
          : 'Chainweb Node was unable to estimate the gas limit for the transaction. Please check your input and try again.',
        ...(error.originalError && { data: error.originalError.stack }),
      },
    });
  }

  if (error instanceof ZodError) {
    if (error.issues.length > 1) {
      return new GraphQLError('Input Validation Error', {
        extensions: {
          type: 'ZodError',
          message: 'Multiple validation issues found. See data for details.',
          description:
            'The input provided is invalid. Check the input and try again.',
          data: error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path.join('.'),
          })),
        },
      });
    }
    return new GraphQLError('Input Validation Error', {
      extensions: {
        type: 'ZodError',
        message: `${error.issues[0].message}: ${error.issues[0].path.join(
          '.',
        )}`,
        description:
          'The input provided is invalid. Check the input and try again.',
      },
    });
  }

  if (
    error instanceof Error &&
    'code' in error &&
    'type' in error &&
    error.code === 'ECONNREFUSED'
  ) {
    return new GraphQLError('Chainweb Node Connection Refused', {
      extensions: {
        type: error.type,
        message: error.message,
        description:
          'Chainweb Node connection refused. Are you sure the Chainweb Node is running and reachable?',
        data: error.stack,
      },
    });
  }

  return new GraphQLError('Unknown error occured.', {
    extensions: {
      type: 'UnknownError',
      message: (error as Error).message,
      description: 'An unknown error occured. Check the logs for more details.',
      data: (error as Error).stack,
    },
  });
}
