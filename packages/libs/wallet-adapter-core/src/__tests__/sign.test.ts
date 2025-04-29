/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ICommand,
  IQuicksignResponse,
  IUnsignedCommand,
} from '@kadena/client';
import { describe, expect, it, vi } from 'vitest';
import { ERRORS } from '../utils/constants';
import {
  convertSignRequest,
  finalizeQuickSignTransaction,
  isExecCommand,
  parseTransactionCommand,
  prepareQuickSignCmd,
  prepareSignCmd,
} from '../utils/sign';

import type {
  ICommandPayload,
  IContPayload,
  IExecPayload,
} from '@kadena/types';

vi.mock('@kadena/client', () => ({
  addSignatures: (
    transaction: IUnsignedCommand,
    ...signatures: { sig: string; pubKey?: string }[]
  ): ICommand | IUnsignedCommand => {
    const result = {
      ...transaction,
      appliedSigs: signatures,
    } as unknown;
    return result as ICommand;
  },
}));

describe('sign utilities', () => {
  const execPayload: IExecPayload = { code: 'c', data: { x: 1 } };
  const baseCommand = {
    networkId: 'n1',
    payload: { exec: execPayload },
    signers: [{ pubKey: 'pk1', clist: [{ name: 'm.c.cap', args: [1, 2] }] }],
    meta: { chainId: 'n1', gasLimit: 10, gasPrice: 1, sender: 's', ttl: 5 },
    nonce: 'nonce',
  } as unknown as ICommandPayload;

  const unsignedCommand: IUnsignedCommand = {
    cmd: JSON.stringify(baseCommand),
    hash: 'h1',
    sigs: [],
  };

  describe('parseTransactionCommand', () => {
    it('parses JSON cmd field into an object', () => {
      const parsed = parseTransactionCommand(unsignedCommand);
      expect(parsed).toEqual(baseCommand);
    });

    it('returns IPactCommand-like object unchanged when no cmd field', () => {
      const noCmdObj = { foo: 'bar' };
      // @ts-expect-error: testing fallback branch
      expect(parseTransactionCommand(noCmdObj)).toEqual(noCmdObj);
    });
  });

  describe('isExecCommand', () => {
    it('returns true when payload.exec exists', () => {
      const parsed = parseTransactionCommand(unsignedCommand);
      expect(isExecCommand(parsed)).toBe(true);
    });

    it('returns false when payload.cont exists instead', () => {
      const contObj: IContPayload = {
        pactId: 'p',
        step: 1,
        rollback: false,
        data: null,
        proof: null,
      };
      const parsed = { ...baseCommand, payload: { cont: contObj } };
      expect(isExecCommand(parsed as any)).toBe(false);
    });
  });

  describe('convertSignRequest', () => {
    it('throws if transaction is not exec', () => {
      const contPayload: IContPayload = {
        pactId: 'p',
        step: 1,
        rollback: false,
        data: null,
        proof: null,
      };
      const contCmd = { ...baseCommand, payload: { cont: contPayload } };
      expect(() => convertSignRequest(contCmd as any)).toThrow(
        ERRORS.CONT_TRANSACTIONS_NOT_SUPPORTED,
      );
    });

    it('converts exec command into ISigningRequestPartial', () => {
      const partial = convertSignRequest(baseCommand as any);
      expect(partial.code).toBe('c');
      expect(partial.data).toEqual({ x: 1 });
      expect(partial.caps[0]).toMatchObject({
        role: 'cap',
        description: 'Description for m.c.cap',
        cap: { name: 'm.c.cap', args: [1, 2] },
      });
      expect(partial.chainId).toBe('n1');
      expect(partial.sender).toBe('s');
      expect(partial.nonce).toBe('nonce');
    });
  });

  describe('prepareSignCmd', () => {
    it('returns ISigningRequestPartial unchanged', () => {
      const req = { caps: [], code: 'foo' };
      expect(prepareSignCmd(req)).toBe(req);
    });

    it('parses and converts raw command', () => {
      const result = prepareSignCmd(unsignedCommand);
      expect(result).toHaveProperty('code', 'c');
      expect(result).toHaveProperty('caps');
    });
  });

  describe('prepareQuickSignCmd', () => {
    it('throws if called with no transaction', async () => {
      // @ts-expect-error: testing error branch
      await expect(prepareQuickSignCmd(undefined)).rejects.toThrow(
        ERRORS.NO_TRANSACTIONS_TO_SIGN,
      );
    });

    it('throws on network mismatch', async () => {
      const otherCommand: IUnsignedCommand = {
        cmd: JSON.stringify({ ...baseCommand, networkId: 'n2' }),
        hash: 'h2',
        sigs: [],
      };
      await expect(
        prepareQuickSignCmd([unsignedCommand, otherCommand]),
      ).rejects.toThrow(ERRORS.NETWORK_MISMATCH);
    });

    it('prepares single transaction', async () => {
      const out = await prepareQuickSignCmd(unsignedCommand);
      expect(out.commandSigDatas).toEqual([
        {
          cmd: unsignedCommand.cmd,
          sigs: [
            {
              pubKey: 'pk1',
              sig: null,
            },
          ],
        },
      ]);
      expect(out.transactionHashes).toEqual(['h1']);
      expect(out.isList).toBe(false);
    });

    it('prepares a list of transactions', async () => {
      const arr = [unsignedCommand, unsignedCommand];
      const out = await prepareQuickSignCmd(arr);
      expect(out.transactions).toHaveLength(2);
      expect(out.isList).toBe(true);
    });
  });

  describe('finalizeQuickSignTransaction', () => {
    it('throws on non-outcomes response', () => {
      expect(() =>
        finalizeQuickSignTransaction(
          {} as unknown as IQuicksignResponse,
          [],
          [],
          false,
        ),
      ).toThrow(ERRORS.ERROR_SIGNING_TRANSACTION);
    });

    it('throws on non-array responses', () => {
      expect(() =>
        finalizeQuickSignTransaction(
          { responses: null } as unknown as IQuicksignResponse,
          [],
          [],
          false,
        ),
      ).toThrow(ERRORS.ERROR_SIGNING_TRANSACTION);
    });

    it('throws on hash mismatch', () => {
      const resp = {
        responses: [
          {
            commandSigData: { sigs: [], cmd: '' },
            outcome: { hash: 'wrong', result: 'success' },
          },
        ],
      } as IQuicksignResponse;
      expect(() =>
        finalizeQuickSignTransaction(resp, ['h1'], [unsignedCommand], false),
      ).toThrow(ERRORS.TRANSACTION_HASH_MISMATCH('h1', 'wrong'));
    });

    it('applies signatures and returns updated transactions', () => {
      const resp = {
        responses: [
          {
            commandSigData: { sigs: [{ pubKey: 'pk1', sig: 's1' }], cmd: '' },
            outcome: { hash: 'h1', result: 'success' },
          },
        ],
      } as IQuicksignResponse;
      const result = finalizeQuickSignTransaction(
        resp,
        ['h1'],
        [unsignedCommand],
        true,
      );
      expect(Array.isArray(result)).toBe(true);
      expect((result as any[])[0]).toHaveProperty('appliedSigs');
    });
  });
});
