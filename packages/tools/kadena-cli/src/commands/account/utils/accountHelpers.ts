import type {
  ZodError,
  ZodIssue,
  ZodIssueCode,
  ZodIssueOptionalMessage,
} from 'zod';
import { z } from 'zod';

import type { ChainId } from '@kadena/types';
import { MAX_FUND_AMOUNT } from '../../../constants/account.js';
import { MAX_CHAIN_VALUE } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { isNotEmptyString, notEmpty } from '../../../utils/globalHelpers.js';

export async function getAllAccountNames(): Promise<
  {
    alias: string;
    name: string;
  }[]
> {
  const allAccountDetails = await services.account.list();
  return allAccountDetails.map(({ alias, name }) => ({ alias, name }));
}

export const formatZodFieldErrors = (error: ZodError): string =>
  error.errors.map((e: ZodIssue) => e.message).join('\n');

const chainIdErrorMsgMap: { [key in Partial<ZodIssueCode>]?: string } = {
  too_small: 'must be greater than or equal to 0',
  too_big: `must be less than or equal to ${MAX_CHAIN_VALUE}`,
  invalid_type: `must be a number between 0 and ${MAX_CHAIN_VALUE}`,
};

const chainIdValidationErrorMapper = (
  error: ZodIssueOptionalMessage,
): { message: string } => {
  const errorMsg = isNotEmptyString(chainIdErrorMsgMap[error.code])
    ? chainIdErrorMsgMap[error.code]
    : `must be a valid chain id between 0 and ${MAX_CHAIN_VALUE}`;
  return {
    message: errorMsg as string,
  };
};

export const chainIdValidation = z
  .number({
    errorMap: chainIdValidationErrorMapper,
  })
  .int()
  .min(0)
  .max(MAX_CHAIN_VALUE);

export const chainIdRangeValidation = z
  .array(
    z
      .number({
        errorMap: chainIdValidationErrorMapper,
      })
      .int()
      .min(0)
      .max(MAX_CHAIN_VALUE),
  )
  .nonempty();

export const createFundAmountValidation = (
  numberOfChains: number,
  maxValue = MAX_FUND_AMOUNT,
): z.ZodNumber =>
  z
    .number({
      errorMap: (error) => {
        if (error.code === 'too_small') {
          return {
            message: 'must be greater than or equal to 1',
          };
        }

        if (error.code === 'too_big') {
          return {
            message: `With ${numberOfChains} chains to fund, the max amount per chain is ${maxValue} coin(s).`,
          };
        }

        return {
          message: `must be a positive number (1 - ${maxValue})`,
        };
      },
    })
    .min(1)
    .max(maxValue);

export const getChainIdRangeSeparator = (
  input: string,
): ',' | '-' | undefined => {
  const hasComma = input.includes(',');
  const hasHyphen = input.includes('-');
  return hasComma ? ',' : hasHyphen ? '-' : undefined;
};

const getChainIds = (
  input: string,
  separator?: ',' | '-',
): number[] | undefined => {
  if (!isNotEmptyString(separator)) {
    return [parseInt(input.trim(), 10)];
  } else if (separator === ',') {
    const splitValue = new Set(input.split(','));
    return [...splitValue]
      .map((id) => parseInt(id.trim(), 10))
      .filter(notEmpty);
  } else if (separator === '-') {
    let [start, end] = input.split('-').map((id) => parseInt(id.trim(), 10));
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
};

export const parseChainIdRange = (input: string): number[] | undefined => {
  const indexRangeSeparator = getChainIdRangeSeparator(input);
  const chainIds = getChainIds(input, indexRangeSeparator);
  return chainIds;
};

export const getTransactionExplorerUrl = (
  explorerURL: string,
  requestKey: string,
): string => {
  const baseURL = explorerURL.endsWith('/') ? explorerURL : `${explorerURL}/`;
  return `${baseURL}${requestKey}`;
};

export const isKAccount = (accountName: string): boolean =>
  accountName.startsWith('k:');

export const isValidForOnlyKeysAllPredicate = (
  accountName: string,
  publicKeys: string[],
): boolean => isKAccount(accountName) && publicKeys.length === 1;

export const sortChainIds = (chainIds: ChainId[]): ChainId[] =>
  chainIds.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

interface IMaxAccountFundParams {
  maxAmount: number;
  numberOfChains: number;
}

export const isValidMaxAccountFundParams = (
  param: unknown,
): param is IMaxAccountFundParams => {
  if (typeof param !== 'object' || param === null) {
    return false;
  }

  const obj = param as Record<string, unknown>;
  return (
    typeof obj.maxAmount === 'number' && typeof obj.numberOfChains === 'number'
  );
};
