import { ChainId } from '@kadena/types';

import { ContCommand, getContCommand, pollSpvProof } from '../contPact';

let targetChainId: ChainId;
let requestKey: string;
let apiHost: string;
let step: number;
let rollback: boolean;

beforeEach(() => {
  targetChainId = '1';
  requestKey = 'requestKey';
  apiHost = 'apiHost';
  step = 1;
  rollback = false;
});
describe('ContCommand', () => {
  describe('createCommand', () => {
    test('should return a valid command', () => {
      const contCommand = new ContCommand('proof', 1, 'pactId', true);
      contCommand.setMeta({
        sender: 'sender',
        chainId: '1',
        gasLimit: 1,
        gasPrice: 1,
      });

      const command = contCommand.createCommand();

      expect(command).toBeDefined();
      expect(command.hash).toBeDefined();
      expect(command.sigs).toBeDefined();
      expect(command.cmd).toBeDefined();
      expect(contCommand.cmd).toEqual(command.cmd);
      expect(contCommand.status).toEqual('non-malleable');
    });
  });

  describe('pollSpvProof', () => {
    it('should return the SPV Proof Response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
      });

      const response = await pollSpvProof(requestKey, targetChainId, apiHost);

      expect(response).toBeDefined();
      expect(response?.status).toBe(200);
    });

    it('should throw an error if timeout is reached', async () => {
      // Mock the fetch function
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
      });

      await expect(
        pollSpvProof(requestKey, targetChainId, apiHost, {
          timeout: 100,
        }),
      ).rejects.toThrow('Timeout reached');
    }, 10000);

    it('should be undefined if fetch throws an error', async () => {
      // Mock the fetch function
      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));

      const response = await pollSpvProof(requestKey, targetChainId, apiHost);

      expect(response).toBeUndefined();
    });
  });
  describe('getContCommand', () => {
    it('should return a ContCommand instance with the set proof', async () => {
      const mockProof = 'proof';
      const mockResponse = {
        status: 200,
        text: jest.fn().mockResolvedValue(mockProof),
      };

      require('../contPact').pollSpvProof = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const contCommand = await getContCommand(
        requestKey,
        targetChainId,
        apiHost,
        step,
        rollback,
      );

      expect(contCommand).toBeInstanceOf(ContCommand);
      expect(contCommand.proof).toBe(mockProof);
      expect(contCommand.step).toBe(step);
      expect(contCommand.pactId).toBe(requestKey);
      expect(contCommand.rollback).toBe(rollback);
    });

    it('should throw an error if unable to obtain SPV Proof', async () => {
      require('../contPact').pollSpvProof = jest
        .fn()
        //@ts-ignore
        .mockResolvedValue(undefined);
      await expect(
        getContCommand(requestKey, targetChainId, apiHost, step, rollback),
      ).rejects.toThrow('Unable to obtain SPV Proof');
    });
  });
});
