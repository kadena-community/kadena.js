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

interface IError {
  message: string;
  status?: string;
}

type ISignerStatus = 'init' | 'notsigning' | 'signing' | 'success' | 'error';

interface IUploadResult {
  imageCid: string;
  imageUrl: string;
  imageUrlUpload: string;
  metadataCid: string;
  metadataUrl: string;
  metadataUrlUpload: string;
}
