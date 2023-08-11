export type WalletConnectModal = Awaited<
  ReturnType<typeof createModalInstance>
>;

export const createModalInstance = async (projectId: string) => {
  const { WalletConnectModal } = await import('@walletconnect/modal');
  const modal = new WalletConnectModal({
    projectId,
    themeMode: 'light',
  });
  return modal;
};
