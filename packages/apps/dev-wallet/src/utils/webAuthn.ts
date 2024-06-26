import * as asn1js from 'asn1js';
import * as cbor from 'cbor-web';
import elliptic from 'elliptic';

export interface PublicKeyCredentialCreate extends PublicKeyCredential {
  response: AuthenticatorAttestationResponse;
}

function i2hex(i: number) {
  return ('0' + i.toString(16)).slice(-2);
}

export const hex = (bytes: Uint8Array) => Array.from(bytes).map(i2hex).join('');

export function base64URLencode(utf8Arr: Uint8Array) {
  const base64Encoded = Buffer.from(utf8Arr).toString('base64');
  return base64Encoded
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64URLdecode(str: string) {
  const base64Encoded = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const base64WithPadding = base64Encoded + padding;
  return new TextEncoder().encode(atob(base64WithPadding));
}

export async function createCredential() {
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const userId = new Uint8Array(16);
  window.crypto.getRandomValues(userId);

  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge,
    rp: {
      name: 'dev-wallet',
    },
    user: {
      id: userId,
      name: 'user@dev-wallet',
      displayName: 'user',
    },
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7,
      },
    ],
    // authenticatorSelection: {
    //   authenticatorAttachment: 'platform',
    // },
    timeout: 60000,
    attestation: 'none',
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyOptions,
    })) as PublicKeyCredentialCreate;
    return { credential, challenge, userId };
  } catch (err) {
    console.error('Error creating credential:', err);
  }
}

export interface PublicKeyCredentialRetrieve extends PublicKeyCredential {
  response: AuthenticatorAssertionResponse;
}

export async function retrieveCredential(
  credentialId: ArrayBuffer,
  challenge = new Uint8Array(32),
) {
  window.crypto.getRandomValues(challenge);
  const credential = (await navigator.credentials.get({
    publicKey: {
      allowCredentials: [
        {
          id: credentialId,
          type: 'public-key',
        },
      ],
      challenge,
    },
  })) as PublicKeyCredentialRetrieve | null;
  if (credential === null) {
    throw new Error('CREDENTIAL_IS_NULL');
  }
  if (credential.response?.clientDataJSON === undefined) {
    throw new Error('NO_CLIENT_DATA_JSON');
  }
  const clientDataJSON = new TextDecoder().decode(
    credential.response.clientDataJSON,
  );
  const json = JSON.parse(clientDataJSON);
  if (json.type !== 'webauthn.get') {
    throw new Error('INVALID_CREDENTIAL_TYPE');
  }
  const base64Challenge = base64URLencode(challenge);
  if (json.challenge !== base64Challenge) {
    console.error('Challenge:', base64Challenge);
    throw new Error('INVALID_CHALLENGE');
  }

  return credential;
}

async function convertPublicKeyToCryptoKey(publicKey: ArrayBuffer) {
  // Convert COSE Key to ArrayBuffer
  const coseKey = publicKey;

  // Convert ArrayBuffer to CryptoKey
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    coseKey,
    {
      name: 'ECDSA',
      namedCurve: 'P-256', // Adjust curve based on your algorithm
    },
    true,
    ['verify'],
  );

  return cryptoKey;
}

const appendBuffer = function (buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

export async function verifySignature(
  responseData: PublicKeyCredentialRetrieve['response'],
  publicKey: ArrayBuffer,
) {
  // Implement your signature verification logic here
  // This could involve decoding and validating the signature against the challenge and other data
  // You might use Web Crypto API or external libraries for cryptographic operations
  // Example:
  try {
    const isVerified = await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      await convertPublicKeyToCryptoKey(publicKey),
      responseData.signature,
      appendBuffer(responseData.authenticatorData, responseData.clientDataJSON),
    );

    return isVerified;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

export async function verifyWebAuthnResponse(
  assertion: PublicKeyCredentialRetrieve,
  publicKey: ArrayBuffer,
) {
  const signature = assertion.response.signature;

  const clientDataJSON = assertion.response.clientDataJSON;

  const authenticatorData = new Uint8Array(
    assertion.response.authenticatorData,
  );

  const clientDataHash = new Uint8Array(
    await crypto.subtle.digest('SHA-256', clientDataJSON),
  );

  // concat authenticatorData and clientDataHash
  const signedData = new Uint8Array(
    authenticatorData.length + clientDataHash.length,
  );
  signedData.set(authenticatorData);
  signedData.set(clientDataHash, authenticatorData.length);

  // import key
  const key = await crypto.subtle.importKey(
    // The getPublicKey() operation thus returns the credential public key as a SubjectPublicKeyInfo. See:
    //
    // https://w3c.github.io/webauthn/#sctn-public-key-easy
    //
    // crypto.subtle can import the spki format:
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
    'spki', // "spki" Simple Public Key Infrastructure rfc2692

    publicKey,
    {
      // these are the algorithm options
      // await cred.response.getPublicKeyAlgorithm() // returns -7
      // -7 is ES256 with P-256 // search -7 in https://w3c.github.io/webauthn
      // the W3C webcrypto docs:
      //
      // https://www.w3.org/TR/WebCryptoAPI/#informative-references (scroll down a bit)
      //
      // ES256 corrisponds with the following AlgorithmIdentifier:
      name: 'ECDSA',
      namedCurve: 'P-256',
      hash: { name: 'SHA-256' },
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ['verify'], //"verify" for public key import, "sign" for private key imports
  );

  // Convert signature from ASN.1 sequence to "raw" format
  const usignature = new Uint8Array(signature);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);
  const rawSignature = new Uint8Array([...r, ...s]);

  // check signature with public key and signed data
  const verified = await crypto.subtle.verify(
    { name: 'ECDSA', namedCurve: 'P-256', hash: { name: 'SHA-256' } } as any,
    key,
    rawSignature,
    signedData.buffer,
  );
  return verified;
}

async function sha256(clientDataJSON: ArrayBuffer) {
  return await window.crypto.subtle.digest('SHA-256', clientDataJSON);
}

function concatenateData(
  authenticatorData: ArrayBuffer,
  clientDataHash: ArrayBuffer,
) {
  const concatenated = new Uint8Array(
    authenticatorData.byteLength + clientDataHash.byteLength,
  );
  concatenated.set(new Uint8Array(authenticatorData), 0);
  concatenated.set(
    new Uint8Array(clientDataHash),
    authenticatorData.byteLength,
  );
  return concatenated;
}

async function recoverPublicKeyFromSignature(
  signature: Uint8Array,
  concatenatedData: Uint8Array,
) {
  const usignature = new Uint8Array(signature);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);

  const ec = new elliptic.ec('p256');

  const rBigInt = BigInt('0x' + hex(r));
  const sBigInt = BigInt('0x' + hex(s));

  const sig = { r: rBigInt.toString(16), s: sBigInt.toString(16) };

  const messageHash = new Uint8Array(await sha256(concatenatedData));

  return [
    ec.recoverPubKey(messageHash, sig, 0),
    ec.recoverPubKey(messageHash, sig, 1),
  ];
}

export const getPublicKeyForKadena = async (attestationObject: ArrayBuffer) => {
  const { authData } = cbor.decode(attestationObject);

  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value: number, index: number) =>
    dataView.setUint8(index, value),
  );
  const credentialIdLength = dataView.getUint16(0);
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  return Buffer.from(publicKeyBytes).toString('hex');
};

export function extractPublicKeyHex(arrayBuffer: ArrayBuffer) {
  // Convert ArrayBuffer to Uint8Array
  const uint8Array = new Uint8Array(arrayBuffer);

  // Parse the DER-encoded SubjectPublicKeyInfo
  const asn1 = asn1js.fromBER(uint8Array.buffer);
  if (asn1.offset === -1) {
    throw new Error('Error parsing ASN.1 structure');
  }

  // SubjectPublicKeyInfo structure
  const subjectPublicKeyInfo = asn1.result;

  // Extract the subjectPublicKey field (bit string)
  const subjectPublicKey = (subjectPublicKeyInfo.valueBlock as any).value[1];
  const publicKeyBytes = subjectPublicKey.valueBlock.valueHex;

  const rawPubKeyHex = Buffer.from(publicKeyBytes).toString('hex');

  const ec = new elliptic.ec('p256');
  const key = ec.keyFromPublic(rawPubKeyHex, 'hex');

  return key.getPublic().encode('hex', false);
}

export async function recoverPublicKey(assertion: PublicKeyCredentialRetrieve) {
  const authenticatorData = assertion.response.authenticatorData;
  const clientDataJSON = assertion.response.clientDataJSON;
  const signature = new Uint8Array(assertion.response.signature);

  const clientDataHash = await sha256(clientDataJSON);
  const concatenatedData = concatenateData(authenticatorData, clientDataHash);

  const recoveredPublicKey = await recoverPublicKeyFromSignature(
    signature,
    concatenatedData,
  );
  return recoveredPublicKey.map((p) => p.encode('hex', false));
}
