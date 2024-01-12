import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { PactCommandError } from '@services/node-service';
import { GraphQLError } from 'graphql';

/**
 * Checks what type of error it is and returns a normalized GraphQLError with the correct type, message and a description that clearly translates to the user what the error means.
 */
export function normalizeError(error: any): GraphQLError {
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

  if (error.type === 'system' && error.code === 'ECONNREFUSED') {
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
      message: error.message,
      description: 'An unknown error occured. Check the logs for more details.',
      data: error.stack,
    },
  });
}
