'use client';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  SideBarHeaderContext,
  SideBarLayout,
  useLayout,
} from '@kadena/kode-ui/patterns';

import { ActiveTransactionsList } from '@/components/ActiveTransactionsList/ActiveTransactionsList';
import { StepperAssetForm } from '@/components/AssetForm/StepperAssetForm';
import { AssetInfo } from '@/components/AssetInfo/AssetInfo';
import { TransactionPendingIcon } from '@/components/TransactionPendingIcon/TransactionPendingIcon';
import { useTransactions } from '@/hooks/transactions';
import { getAsset } from '@/utils/getAsset';
import { MonoAccountBalanceWallet } from '@kadena/kode-icons';
import { Button, Heading, Link, Stack } from '@kadena/kode-ui';
import React, { useEffect, useRef, useState } from 'react';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openTransactionsSide, setOpenTransactionsSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { transactions, setTxsButtonRef, setTxsAnimationRef } =
    useTransactions();
  const txsButtonRef = useRef<HTMLButtonElement | null>(null);
  const transactionAnimationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!txsButtonRef.current || !transactionAnimationRef.current) return;
    setTxsButtonRef(txsButtonRef.current);
    setTxsAnimationRef(transactionAnimationRef.current);
  }, [txsButtonRef.current, transactionAnimationRef.current]);

  if (!getAsset()) {
    return (
      <Stack
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="center"
        style={{ height: '100dvh' }}
      >
        <div>
          <Heading>Add new asset</Heading>
          <StepperAssetForm />
        </div>
      </Stack>
    );
  }

  return (
    <>
      <SideBarHeaderContext>
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
            <KLogo height={40} />
          </Link>
        }
        sidebar={<SideBar />}
      >
        <Stack width="100%" flexDirection="column" gap="sm">
          <AssetInfo />
          {children}
        </Stack>
      </SideBarLayout>

      <div ref={transactionAnimationRef} />
    </>
  );
};

export default RootLayout;
