interface IAccount {
  displayName: string;
  waccount: string;
  caccount: string;
  publicKey: string;
  cid: string;
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

type TokenType = 'multi' | 'event';

interface IProofOfUsData {
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
  tokenId: string;
  image: string;
  name: string;
  properties: {
    type: TokenType;
    date: number;
    avatar?: {
      backgroundColor: string;
      color: string;
    };
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

type IProofOfUsSignee = Pick<IAccount, 'displayName' | 'publicKey' | 'cid'> & {
  label?: string;
  signerStatus: ISignerStatus;
  initiator: boolean;
  socialLinks?: ISocial[];
  position?: ISigneePosition;
};
