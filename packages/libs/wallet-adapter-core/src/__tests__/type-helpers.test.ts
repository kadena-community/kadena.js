import { describe, expect, it } from 'vitest';
import type { IJsonRpcSuccess, JsonRpcResponse } from '../types';
import { isJsonRpcResponse, isJsonRpcSuccess } from '../utils/type-helpers';

describe('type-helpers', () => {
  describe('isJsonRpcResponse', () => {
    it('returns true for a valid JSON-RPC success response', () => {
      const resp = { id: 1, jsonrpc: '2.0', result: { foo: 'bar' } };
      expect(isJsonRpcResponse(resp)).toBe(true);
    });

    it('returns true for a valid JSON-RPC error response', () => {
      const resp = {
        id: 2,
        jsonrpc: '2.0',
        error: { code: -1, message: 'err' },
      };
      expect(isJsonRpcResponse(resp)).toBe(true);
    });

    it('returns false if "jsonrpc" is missing or incorrect', () => {
      expect(isJsonRpcResponse({ id: 1, result: {} })).toBe(false);
      expect(isJsonRpcResponse({ id: 1, jsonrpc: '1.0', result: {} })).toBe(
        false,
      );
    });

    it('returns false if "id" is missing', () => {
      expect(isJsonRpcResponse({ jsonrpc: '2.0', result: {} })).toBe(false);
    });

    it('returns false if both "result" and "error" are present', () => {
      const resp = {
        id: 3,
        jsonrpc: '2.0',
        result: {},
        error: { code: 0, message: '' },
      };
      expect(isJsonRpcResponse(resp)).toBe(false);
    });

    it('returns false for non-object inputs', () => {
      expect(isJsonRpcResponse(null)).toBe(false);
      expect(isJsonRpcResponse(123)).toBe(false);
      expect(isJsonRpcResponse('foo')).toBe(false);
    });
  });

  describe('isJsonRpcSuccess', () => {
    it('narrowly returns true for a JsonRpcSuccess response', () => {
      const success: IJsonRpcSuccess<{ x: number }> = {
        id: 4,
        jsonrpc: '2.0',
        result: { x: 42 },
      };

      if (isJsonRpcSuccess(success)) {
        expect(success.result.x).toBe(42);
      } else {
        // If it were false, test should fail
        throw new Error(
          'Expected success response to be recognized as success',
        );
      }
    });

    it('returns false for a JSON-RPC error response', () => {
      const errorResp: JsonRpcResponse<unknown> = {
        id: 5,
        jsonrpc: '2.0',
        error: { code: -2, message: 'fail' },
      };
      expect(isJsonRpcSuccess(errorResp)).toBe(false);
    });

    it('returns false if "result" is undefined', () => {
      const resp: JsonRpcResponse<void> = {
        id: 6,
        jsonrpc: '2.0',
        result: undefined,
      };
      expect(isJsonRpcSuccess(resp)).toBe(false);
    });
  });
});
