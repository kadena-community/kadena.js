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
  token?: any;
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
  tokenId: string;
  requestKey: string;
  manifestUri?: string;
  imageUri: string;
  eventName?: string;
  eventId: string;
  mintStatus: IMintStatus;
  status: IBuildStatusValues;
  backgroundColor?: string;
  tokenId?: string;
  proofOfUsId: string;
  type: TokenType;
  date: number;
  minted?: number;
  title?: string;
  uri?: string;
  isReadyToSign: boolean;
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
  manifestUri?: string;
  startDate?: int;
  endDate?: int;
  description: string;
  image: string;
  name: string;
  properties: {
    eventName?: string;
    eventId?: string;
    eventType: TokenType;
    date: number;
    avatar?: {
      backgroundColor: string;
    };
    signees?: IProofOfUsTokenSignee[];
  };

  authors: { name: string }[];
  collection: {
    name: string;
    family: string;
  };
}

interface IProofOfUsTokenMetaWithkey extends IProofOfUsTokenMeta {
  requestKey: string;
  tokenId: string;
  mintStatus: 'error' | 'success' | 'init' | undefined;
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

type ISignerStatus = 'init' | 'notsigning' | 'signing' | 'success' | 'error';

type ISocial = string;

interface ISigneePosition {
  xPercentage: number;
  yPercentage: number;
}

type IProofOfUsSignee = Pick<IAccount, 'accountName' | 'alias'> & {
  name?: string;
  signerStatus: ISignerStatus;
  signature?: string;
  initiator: boolean;
  socialLink?: ISocial;
  position?: ISigneePosition;
  publicKey: string;
  lastPingTime?: number;
};

type IAccountLeaderboard = Pick<IAccount, 'alias' | 'accountName'> & {
  tokenCount: number;
};

type IProofOfUsTokenSignee = Pick<
  IProofOfUsSignee,
  'accountName' | 'socialLink' | 'position'
> & {
  name: string;
};

interface IToken {
  eventId?: string;
  proofOfUsId?: string;
  requestKey?: string;
  id: string;
  info?: {
    uri: string;
  };
  mintStartDate?: number;
  listener?: Promise<any>;
}

interface IUploadResult {
  imageCid: string;
  imageUrl: string;
  imageUrlUpload: string;
  metadataCid: string;
  metadataUrl: string;
  metadataUrlUpload: string;
}
