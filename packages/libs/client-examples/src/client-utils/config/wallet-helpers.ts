/**
 * this file demonstrates how a wallet can provide keys and sign function.
 * in a real world scenario, you should never expose your private keys.
 * this will be handled by your wallet.
 */

import { createSignWithKeypair } from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';

// you can change this with your own keypairs
export const GAS_PAYER = genKeyPair();
export const SENDER = genKeyPair();
export const RECEIVER = genKeyPair();

export const signMethod = createSignWithKeypair([GAS_PAYER, SENDER, RECEIVER]);
