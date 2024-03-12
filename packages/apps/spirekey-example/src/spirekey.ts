import { IUnsignedCommand } from '@kadena/client';

export class KadenaSpireKey {
  private _returnUrl: string;
  private _spireKeyHostname: string;
  private _user: IUser | null = null;
  private _transactions: Record<string, IUnsignedCommand> = {};
  private _storage: Storage;
  private _location: Location;
  private _history: History;

  constructor(
    spireKeyHostname: string,
    returnUrl: string,
    browserApis?: { storage: Storage; location: Location; history: History },
  ) {
    this._spireKeyHostname = spireKeyHostname;
    this._returnUrl = returnUrl;
    this._storage = browserApis?.storage ?? window.sessionStorage;
    this._location = browserApis?.location ?? window.location;
    this._history = browserApis?.history ?? window.history;
    this._loadFromLocalStorage();
    this.update(this._location);
  }

  get isLoggedIn() {
    return this._user !== null;
  }

  get user() {
    return this._user;
  }

  get transactions() {
    return this._transactions;
  }

  update(location: Location) {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has('user')) {
      const userSearch = searchParams.get('user');
      if (userSearch && userSearch?.length > 0) {
        // decode base64
        this._user = JSON.parse(decodeBase64(userSearch));
        console.log('retrieved user from querystring parameters', this._user);
      }
    }

    if (searchParams.has('transaction')) {
      const transactionSearch = searchParams.get('transaction');
      if (transactionSearch && transactionSearch?.length > 0) {
        const transaction: IUnsignedCommand = JSON.parse(
          decodeBase64(transactionSearch),
        );
        console.log(
          'retrieved transaction from querystring parameters',
          JSON.stringify(transaction, null, 2),
        );

        this._transactions[transaction.hash] = transaction;
      }
    }
    this._saveToLocalStorage();
    // clear querystring parameters
    this._history.pushState({}, '', location.pathname);
  }

  login() {
    this._location.href = `${this._spireKeyHostname}/login?returnUrl=${this._returnUrl}`;
  }

  loginOptimistic() {
    this._location.href = `${this._spireKeyHostname}/login?returnUrl=${this._returnUrl}&optimistic=true`;
  }

  logout() {
    this._clearLocalStorage();
    this._location.href = new URL(this._returnUrl).origin;
  }

  sign(tx: IUnsignedCommand) {
    const query: ISignRequestQuerystring = {
      transaction: encodeBase64(JSON.stringify(tx)),
      returnUrl: this._returnUrl,
      optimistic: false,
    };
    const queryString = new URLSearchParams(query as any).toString();
    this._location.href = `${this._spireKeyHostname}/sign?${queryString}`;
  }

  private _saveToLocalStorage() {
    this._storage.setItem('spirekey_user', JSON.stringify(this._user));
    this._storage.setItem(
      'spirekey_transactions',
      JSON.stringify(this._transactions),
    );
  }

  private _loadFromLocalStorage() {
    const user = this._storage.getItem('spirekey_user');
    if (user) {
      this._user = JSON.parse(user);
    }

    const transactions = this._storage.getItem('spirekey_transactions');
    if (transactions) {
      this._transactions = JSON.parse(transactions);
    }
  }

  private _clearLocalStorage() {
    this._storage.removeItem('spirekey_user');
    this._storage.removeItem('spirekey_transactions');
  }
}

/*
- host `https://spirekey.kadena.io`
- path `/sign`
- query-string parameters
  - `transaction`: [`IUnsignedCommand`]() a base64 encoded transaction
  - `returnUrl` the url where the user will be redirected to after signing
  - `optimistic`: `boolean` - when `true`, Kadena SpireKey will return a signed
    transaction, even when there are pending transactions.
    The response will include `pendingTxIds`.
*/
interface ISignRequestQuerystring {
  transaction: string;
  returnUrl: string;
  optimistic?: boolean;
}

/*
- `user`: `base64<JSON>` - base-64 JSON object, from `user` query-string
  parameter
  - `credentials`: `Array<object>`
    - `publicKey`: `string` - The public-key associated with the account
    - `type`: `string` - type of the credential, can be `WebAuthn`
    - `id`: `string` (optional) - The WebAuthn Credential ID. Omitted when
      `type=ED25519`
  - `accountName`: `string` - the c-account of the user
  - `alias`: `string` - Alias the user provided when creating the account in
    Kadena SpireKey
  - `pendingTxIds`: `Array<string>` - List of transaction Request Keys. One of:
    - Account Creation Transaction id: the account is being minted, and the dapp
      can use this to verify when this is completed.
      The `user` object, can already be used to prepare transactions for the
      user.
*/
export interface IUser {
  credentials: Array<{
    publicKey: string;
    type: string;
    id?: string;
  }>;
  accountName: string;
  alias: string;
  pendingTxIds: Array<string>;
}

/*
- host `https://your-dapp.com`
- path `/auth`
- query-string parameters:
  - `transaction`: `base64<IUnsignedCommand>` - base-64 JSON object
  - `pendingTxIds`: `base64<Array<string>>` - List of pending transaction
    Request Keys. The app needs to await them before submitting the returned
    transaction
*/
interface ISignResponse {
  transaction: IUnsignedCommand;
  pendingTxIds: string[];
}

function decodeBase64(msg: string) {
  return atob(msg);
  // return Buffer.from(msg, 'base64').toString();
}

function encodeBase64(msg: string) {
  return btoa(msg);
  // return Buffer.from(msg).toString('base64');
}
