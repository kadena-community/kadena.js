export type WalletConnectModal = Awaited<
  ReturnType<typeof createModalInstance>
>;

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

export const createModalInstance = async () => {
  if (!PROJECT_ID) throw Error("Missing env var 'NEXT_PUBLIC_PROJECT_ID'");
  const { WalletConnectModal } = await import('@walletconnect/modal');
  const modal = new WalletConnectModal({
    projectId: PROJECT_ID,
    themeMode: 'light',
  });
  return modal;
};
