/**
 * @alpha
 */
export interface IUnsignedTransaction {
  hash: string;
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: { [pubkey: string]: string | null };
  cmd: string;
}
