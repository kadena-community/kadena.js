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
