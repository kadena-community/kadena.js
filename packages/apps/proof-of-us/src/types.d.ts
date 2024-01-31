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

interface IProofOfUs {
  tokenId: string;
  type: 'multi' | 'event';
  date: number;
  minted?: number;
  signees: IProofOfUsSignee[];
  avatar: {
    background: string;
  };
}

interface IError {
  message: string;
}

type IProofOfUsSignee = Pick<IAccount, 'displayName' | 'publicKey' | 'cid'> & {
  initiator: boolean;
};
