import { describe, expect, test } from 'vitest';
import { validateRequestKey, validatePublicKey } from './utils';

describe('validation request key', () => {
    test('if request key is valid, return that value', () => {
        const value = 'WFiNqRS1Ow-vRYxX9-AFk_Fe2T74m8lqqaDZmSPn3aa';
        const result = validateRequestKey(value);
        expect(result).toBe('WFiNqRS1Ow-vRYxX9-AFk_Fe2T74m8lqqaDZmSPn3aa');
    });

    test('if request key is not valid, return udefined', () => {
        const value = 'WFiNqRS1Ow';
        const result = validateRequestKey(value);
        expect(result).toBeUndefined();
    });

});

describe('validation public key', () => {
    test('if public key is valid, return that value', () => {
        const value = '5b121d357038e0c50c6de5d2c84aa36f8a48f0b94b7408f86ce8e793737fd18b';
        const result = validatePublicKey(value);
        expect(result).toBe('5b121d357038e0c50c6de5d2c84aa36f8a48f0b94b7408f86ce8e793737fd18b');
    });

    test('if public key is not valid, return udefined', () => {
        const value = 'abcde';
        const result = validatePublicKey(value);
        expect(result).toBeUndefined();
    });
});
