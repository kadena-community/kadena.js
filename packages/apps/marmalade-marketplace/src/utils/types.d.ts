/// <reference types="@kadena/spirekey-sdk" />

type IAccountCrendentialType = 'WebAuthn' | 'ED25519';

interface IAccountCrendential {
  publicKey: string;
  type: IAccountCrendentialType;
}

type IAccount = Account;

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
