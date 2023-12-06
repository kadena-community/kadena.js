import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
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
          'Prisma Client failed to initialize. Are you sure the database is running and reachable?',
        data: error.stack,
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
    } else if (
      (error.commandResult as any).message.includes('Failed reading: mzero')
    ) {
      description =
        'Empty code was most likely sent to the Chainweb Node. Please check your arguments.';
    }

    return new GraphQLError('Chainweb Node Command Failure', {
      extensions: {
        type: error.pactError?.type || 'UnknownType',
        message:
          error.pactError?.message ||
          (error.commandResult as any).message ||
          error.message,
        description,
        data: error.commandResult,
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

/**
 * Checks if the error is a row not found error. An example case is when we loop over all chainIds to get the account details for a module account. If the module account does not exist on a chain, we get a row not found error. We want to ignore this error and continue with the next chainId.
 */
export function isRowNotFoundError(error: any): boolean {
  return (
    error instanceof PactCommandError &&
    error.pactError?.message?.includes('with-read: row not found')
  );
}
