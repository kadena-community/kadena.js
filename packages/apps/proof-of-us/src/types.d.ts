interface IAccount {
  name: string;
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
  date: number;
  minted?: number;
  signees: IProofOfUsSignee[];
}

interface IError {
  message: string;
}

interface IProofOfUsSignee {
  name: string;
  key: string;
}
