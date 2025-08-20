import type { BaseError } from 'viem';
import { ContractFunctionRevertedError } from 'viem';
import { formatErrorMessage } from '../evm';

const getMockErrorWithContractRevert = (
  errorName: string,
  args?: unknown[],
): BaseError => {
  // Create a mock that will properly satisfy the instanceof check
  const contractError = Object.create(ContractFunctionRevertedError.prototype);
  contractError.name = 'ContractFunctionRevertedError';
  contractError.message = 'Contract function reverted';
  contractError.data = { errorName, args };
  contractError.details = '';
  contractError.shortMessage = 'Contract function reverted';
  contractError.version = '1.0.0';

  return {
    name: 'BaseError',
    message: 'Transaction failed',
    details: '',
    shortMessage: 'Transaction failed',
    version: '1.0.0',
    walk: (fn) => {
      if (fn) {
        // The function checks if the result is an instance of ContractFunctionRevertedError
        const result = fn(contractError);
        // If the predicate function returns true (meaning it found a ContractFunctionRevertedError)
        // we return the error itself
        if (result) {
          return contractError;
        }
      }
      return null;
    },
  } as BaseError;
};

describe('evm utils', () => {
  describe('formatErrorMessage', () => {
    it('should return "Transaction failed" if shortMessage is empty', () => {
      const error = {
        name: 'BaseError',
        message: 'Some error',
        details: '',
        shortMessage: '',
        version: '1.0.0',
        walk: () => null,
      } as unknown as BaseError;

      const result = formatErrorMessage(error);
      expect(result).toBe('Transaction failed');
    });

    it('should return shortMessage when error is not instance of ContractFunctionRevertedError', () => {
      const error = {
        name: 'BaseError',
        message: undefined,
        details: '',
        shortMessage: 'He-man master of the universe',
        version: '1.0.0',
        walk: () => null,
      } as unknown as BaseError;

      const result = formatErrorMessage(error);
      expect(result).toBe('He-man master of the universe');
    });

    describe('ContractFunctionRevertedError handling', () => {
      it('should handle CooldownPeriodNotElapsed error with longer cooldown period', () => {
        const lastClaimed = 245575051; // 13 oct 1977
        const cooldownPeriod = 7200; // 2 hours
        const error = getMockErrorWithContractRevert(
          'CooldownPeriodNotElapsed',
          [undefined, lastClaimed, cooldownPeriod],
        );

        const result = formatErrorMessage(error);

        const expectedTimestamp = (lastClaimed + cooldownPeriod) * 1000;
        const expectedDate = new Date(expectedTimestamp);
        expect(result).toBe(
          `Please wait until ${expectedDate.toLocaleString()}. Cooldown period is 2 hours.`,
        );
      });

      it('should handle InsufficientNativeTokenBalance error', () => {
        const error = getMockErrorWithContractRevert(
          'InsufficientNativeTokenBalance',
        );
        const result = formatErrorMessage(error);
        expect(result).toBe('Faucet is out of funds');
      });

      it('should handle InvalidRecipient error', () => {
        const error = getMockErrorWithContractRevert('InvalidRecipient');
        const result = formatErrorMessage(error);
        expect(result).toBe('Invalid recipient address');
      });

      it('should handle TransferNativeTokenFailed error', () => {
        const error = getMockErrorWithContractRevert(
          'TransferNativeTokenFailed',
        );
        const result = formatErrorMessage(error);
        expect(result).toBe('Transfer failed');
      });

      it('should handle unknown contract error', () => {
        const error = getMockErrorWithContractRevert('UnknownError');
        const result = formatErrorMessage(error);
        expect(result).toBe('Transaction failed');
      });

      it('should handle ContractFunctionRevertedError without errorName', () => {
        const error = getMockErrorWithContractRevert('');
        const result = formatErrorMessage(error);
        expect(result).toBe('Transaction failed');
      });
    });
  });
});
