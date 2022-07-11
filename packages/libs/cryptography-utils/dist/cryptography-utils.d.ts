import type { IBase64Url } from '@kadena/types';
import type { IKeyPair } from '@kadena/types';
import type { SignCommand } from '@kadena/types';

/**
 * Takes in Base64 Url encoded string and outputs decoded string
 * code from [https://gist.github.com/1020396] by [https://github.com/atk]
 *
 * @alpha
 */
export declare function base64UrlDecode(str: IBase64Url): string;

/**
 * Takes in a hex string and outputs a Uint8Array binary object.
 *
 * @alpha
 */
export declare function base64UrlDecodeArr(input: IBase64Url): Uint8Array;

/**
 * Takes in string and outputs Base64 Url encoded string
 * code from [https://gist.github.com/999166] by [https://github.com/nignag]
 *
 * @alpha
 */
export declare function base64UrlEncode(str: string): IBase64Url;

/**
 * Takes in Uint8Array binary object and outputs hex string.
 *
 * @alpha
 */
export declare function base64UrlEncodeArr(input: Uint8Array): IBase64Url;

/**
 * Takes in Uint8Array binary object and outputs hex string.
 *
 * @alpha
 */
export declare function binToHex(array: Uint8Array): string;

/**
 * Generate a random ED25519 keypair.
 *
 * @alpha
 */
export declare function genKeyPair(): IKeyPair;

/**
 * Takes in string, outputs blake2b256 hash encoded as unescaped base64url.
 *
 * @alpha
 */
export declare function hash(str: string): string;

/**
 * Takes in string and outputs blake2b256 hash
 *
 * @alpha
 */
export declare function hashBin(str: string): Uint8Array;

/**
 * Takes in hex string and outputs Uint8Array binary object.
 *
 * @alpha
 */
export declare function hexToBin(hexString: string): Uint8Array;

/**
 * @alpha
 */
export declare const pactTestCommand: {
    networkId: undefined | unknown;
    payload: {
        exec: {
            data: {
                'accounts-admin-keyset': string[];
            };
            code: string;
        };
    };
    signers: {
        pubKey: string;
    }[];
    meta: {
        creationTime: number;
        ttl: number;
        gasLimit: number;
        chainId: string;
        gasPrice: number;
        sender: string;
    };
    nonce: string;
};

/**
 * Generate a deterministic ED25519 keypair from a given Kadena secretKey
 *
 * @alpha
 */
export declare function restoreKeyPairFromSecretKey(seed: string): IKeyPair;

/**
 Perform blake2b256 hashing on a message, and sign using keyPair.

 * @alpha
 */
export declare function sign(msg: string, { secretKey, publicKey }: IKeyPair): SignCommand;

/**
 Sign a hash using key pair

 * @alpha
 */
export declare function signHash(hash: string, { secretKey, publicKey }: IKeyPair): SignCommand;

/**
 * Takes in string and outputs Uint8Array
 *
 * @alpha
 */
export declare function strToUint8Array(str: string): Uint8Array;

/**
 * Converts a keypair into Uint8Array binary object, public key attached to secret key
 * @alpha
 */
export declare function toTweetNaclSecretKey({ secretKey, publicKey, }: IKeyPair): Uint8Array;

/**
 * Convert Uint8Array to string
 *
 * @alpha
 */
export declare function uint8ArrayToStr(array: Uint8Array): string;

/**
 * Verifies the signature for the message and returns true if verification succeeded or false if it failed.
 *
 * @alpha
 */
export declare function verifySig(msg: Uint8Array, sig: Uint8Array, pubKey: Uint8Array): boolean;

export { }
