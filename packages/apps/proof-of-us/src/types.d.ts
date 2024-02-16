type IAccountCrendentialType = 'WebAuthn' | 'ED25519';

interface IAccountCrendential {
  publicKey: string;
  type: IAccountCrendentialType;
}

interface IAccount {
  accountName: string;
  alias: string;
  pendingTxIds: string[];
  credentials: IAccountCrendential[];
}

type IBuildStatusValues = 0 | 1 | 2 | 3 | 4;

type ToastType = 'error' | 'success' | 'info';
interface IToast {
  type: ToastType;
  message: string;
}

type IDataHook<T> = (...args: any) => {
  isLoading: boolean;
  error?: IError;
  data: T;
};

type IMintStatus =
  | 'init'
  | 'signing'
  | 'uploading'
  | 'uploading_manifest'
  | 'minting'
  | 'error'
  | 'success';

type IProofOfUsBackground = {
  bg: string;
};

type TokenType = 'connect' | 'attendance';

interface IProofOfUsData {
  tx: IUnsignedCommand;
  eventId: string;
  mintStatus: IMintStatus;
  status: IBuildStatusValues;
  backgroundColor?: string;
  tokenId?: string;
  proofOfUsId: string;
  type: TokenType;
  date: number;
  minted?: number;
  signees: IProofOfUsSignee[];
  title?: string;
  uri?: string;
}

interface IProofOfUsToken {
  'collection-id': string;
  'ends-at': { int: number };
  'starts-at': { int: number };
  'token-id': string;
  uri: string;
  name: string;
  status: 'success' | 'failure';
}

interface IProofOfUsTokenMeta {
  startDate: int;
  endDate: int;
  description: string;
  image: string;
  name: string;
  properties: {
    eventId: string;
    eventType: TokenType;
    date: number;
    avatar?: {
      backgroundColor: string;
    };
    signees?: IProofOfUsTokenSignee[];
  };

  authors: string[];
  collection: {
    name: string;
    family: string;
  };
}

interface IProofOfUs {
  background: IProofOfUsBackground;
  data: IProofOfUsData;
  token?: IProofOfUsToken;
}

interface IError {
  message: string;
  status?: string;
}

type ISignerStatus = 'init' | 'signing' | 'success' | 'error';

type ISocial = string;

interface ISigneePosition {
  xPercentage: number;
  yPercentage: number;
}

type IProofOfUsSignee = Pick<IAccount, 'accountName' | 'alias'> & {
  label?: string;
  signerStatus: ISignerStatus;
  initiator: boolean;
  socialLinks?: ISocial[];
  position?: ISigneePosition;
  publicKey: string;
};

type IProofOfUsTokenSignee = Pick<
  IProofOfUsSignee,
  'label' | 'socialLinks' | 'position'
>;
