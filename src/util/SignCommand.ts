export interface SignCommand {
  sig: string;
  hash: string;
  pubKey: string;
}

export interface preparedCommand {
  hash: string;
  sigs: { sig: string }[];
  cmd: string;
}
