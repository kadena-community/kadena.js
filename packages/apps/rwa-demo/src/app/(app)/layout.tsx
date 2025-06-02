'use client';
import { ActiveTransactionsList } from '@/components/ActiveTransactionsList/ActiveTransactionsList';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { DemoBanner } from '@/components/DemoBanner/DemoBanner';
import { FrozenInvestorBanner } from '@/components/FrozenInvestorBanner/FrozenInvestorBanner';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { GraphOnlineBanner } from '@/components/GraphOnlineBanner/GraphOnlineBanner';
import { TransactionPendingIcon } from '@/components/TransactionPendingIcon/TransactionPendingIcon';
import { useTransactions } from '@/hooks/transactions';
import { useUser } from '@/hooks/user';
import { MonoAccountBalanceWallet } from '@kadena/kode-icons';
import { Button, Link, Stack } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  SideBarHeaderContext,
  SideBarLayout,
  SideBarTopBanner,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import React, { useEffect, useRef, useState } from 'react';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openTransactionsSide, setOpenTransactionsSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const { transactions, setTxsButtonRef, setTxsAnimationRef } =
    useTransactions();
  const txsButtonRef = useRef<HTMLButtonElement | null>(null);
  const transactionAnimationRef = useRef<HTMLDivElement | null>(null);
  const { isMounted } = useUser();

  useEffect(() => {
    if (!txsButtonRef.current || !transactionAnimationRef.current) return;
    setTxsButtonRef(txsButtonRef.current);
    setTxsAnimationRef(transactionAnimationRef.current);
  }, [txsButtonRef.current, transactionAnimationRef.current]);

  if (!isMounted) return 'loading';

  return (
    <>
      <SideBarHeaderContext>
        <SideBarTopBanner>
          <DemoBanner />
          <CookieConsent />
          <GraphOnlineBanner />
          <FrozenInvestorBanner />
          <GasPayableBanner />
        </SideBarTopBanner>
        <Button
          ref={txsButtonRef}
          variant="transparent"
          startVisual={
            transactions.length ? (
              <TransactionPendingIcon />
            ) : (
              <MonoAccountBalanceWallet />
            )
          }
          onPress={() => {
            setOpenTransactionsSide(true);
            setIsRightAsideExpanded(true);
          }}
        />
      </SideBarHeaderContext>

      {isRightAsideExpanded && openTransactionsSide && (
        <RightAside
          isOpen
          onClose={() => {
            setOpenTransactionsSide(false);
            setIsRightAsideExpanded(false);
          }}
        >
          <RightAsideHeader label="Current transactions" />
          <RightAsideContent>
            <ActiveTransactionsList />
          </RightAsideContent>
        </RightAside>
      )}
      <SideBarLayout
        logo={
          <Link href="/">
            <KLogo />
          </Link>
        }
        sidebar={<SideBar />}
      >
        <Stack width="100%" flexDirection="column" gap="sm">
          {children}
        </Stack>
      </SideBarLayout>

      <div ref={transactionAnimationRef} />
    </>
  );
};

export default RootLayout;
