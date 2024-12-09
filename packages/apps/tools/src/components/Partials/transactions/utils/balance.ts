export function getBalanceFromChain(
  balance: number | { decimal: string },
): number {
  return typeof balance === 'number' ? balance : Number(balance.decimal);
}
