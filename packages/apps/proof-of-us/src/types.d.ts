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

type ImageType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';
interface IFile {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  size: number;
  type: ImageType;
}

type Network = 'devnet' | 'testnet' | 'mainnet';
