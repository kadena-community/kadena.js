interface IAccount {
  displayName: string;
  waccount: string;
  caccount: string;
  publicKey: string;
  cid: string;
}

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

type IProofOfUsBackground = string;
interface IProofOfUsData {
  mintStatus: IMintStatus;
  tokenId?: string;
  proofOfUsId: string;
  type: 'multi' | 'event';
  date: number;
  minted?: number;
  signees: IProofOfUsSignee[];
  uri?: string;
}

interface IProofOfUs {
  background: IProofOfUsBackground;
  data: IProofOfUsData;
}

interface IError {
  message: string;
  status?: string;
}

type IProofOfUsSignee = Pick<IAccount, 'displayName' | 'publicKey' | 'cid'> & {
  initiator: boolean;
};
