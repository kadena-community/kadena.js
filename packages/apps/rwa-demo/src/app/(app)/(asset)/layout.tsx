'use client';
import { AssetInfo } from '@/components/AssetInfo/AssetInfo';
import { AssetsList } from '@/components/AssetsList/AssetsList';
import { WalletsList } from '@/components/WalletsList/WalletsList';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';

const AgentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { account, isMounted } = useAccount();
  const { asset } = useAsset();

  if (!isMounted) return null;
  if (!account) return <WalletsList init={true} />;
  if (!asset?.contractName) return <AssetsList />;

  return (
    <>
      <AssetInfo />
      {children}
    </>
  );
};

export default AgentLayout;
