import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { MessageBlock } from '@/components/MessageBlock/MessageBlock';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { useTokens } from '@/hooks/tokens';
import { ICommand } from '@kadena/client';
import { Stack } from '@kadena/kode-ui';
import { sign } from '@kadena/spirekey-sdk';
import { isAfter, isBefore } from 'date-fns';
import Link from 'next/link';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useMemo } from 'react';

interface IProps {
  data: IProofOfUsTokenMeta;
  eventId: string;
  isMinted: boolean;
  handleIsMinted: Dispatch<SetStateAction<boolean>>;
  hideDashboard?: boolean;
}

export const ScanAttendanceEvent: FC<IProps> = ({
  data,
  eventId,
  isMinted,
  hideDashboard = false,
}) => {
  const { claim } = useClaimAttendanceToken();
  const { account, isMounted, login } = useAccount();
  const { addMintingData, tokens } = useTokens();
  const { doSubmit, isStatusLoading, setIsLoading } = useSubmit();

  const tokenId = useMemo(() => {
    const token = tokens?.find((t) => t.info?.uri === data.manifestUri);
    return token?.tokenId;
  }, [tokens, data]);

  const getProof = (
    data: IProofOfUsTokenMeta,
    transaction: ICommand,
  ): IProofOfUsData => {
    const proof: IProofOfUsData = {
      proofOfUsId: data.properties.eventId || '',
      type: 'attendance',
      requestKey: transaction.hash,
      title: data.name,
      isReadyToSign: false,
      mintStatus: 'init',
      imageUri: data.image,
      date: Date.now(),
      eventId: data.properties.eventId || '',
      eventName: data.properties.eventName,
      backgroundColor: data.properties.avatar?.backgroundColor,
      tx: transaction,
      status: 4,
      manifestUri: data.manifestUri,
    };

    return proof;
  };

  const handleClaim = async () => {
    const transaction = await claim(eventId);
    if (!transaction || !account) return;

    try {
      setIsLoading(true);
      const { transactions, isReady } = await sign([transaction], [account]);
      await isReady();

      transactions.map(async (t) => {
        // should perform check to see if all sigs are present
        const proof = getProof(data, t as ICommand);
        await addMintingData(proof);
        await doSubmit(
          Buffer.from(JSON.stringify(t)).toString('base64'),
          proof,
        );
      });
    } catch (e) {
      setIsLoading(false);
    }
  };

  const startDate = new Date(data.startDate * 1000);
  const endDate = new Date(data.endDate * 1000);

  const hasStarted = isBefore(startDate, Date.now());
  const hasEnded = isAfter(Date.now(), endDate);

  const showClaimButton = hasStarted && !hasEnded && !isMinted && account;

  return (
    <>
      {isStatusLoading && <MainLoader />}
      <AttendanceTicket data={data} />

      <Stack flexDirection="column">
        {!hasStarted && (
          <div>
            <Stack flexDirection="column" gap="md">
              <MessageBlock title={''}>
                {' '}
                the event has not started yet. please check back{' '}
                {startDate.toLocaleDateString()}{' '}
                {startDate.toLocaleTimeString()} to claim the nft
              </MessageBlock>
              <Stack gap="md">
                {!isMinted && account && !hideDashboard && (
                  <Stack>
                    <Link href="/user">
                      <Button>Dashboard</Button>
                    </Link>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </div>
        )}
        {hasEnded && (
          <Stack flexDirection="column" gap="md">
            <MessageBlock title={''}>The event has ended.</MessageBlock>
            <Stack gap="md">
              {!isMinted && account && !hideDashboard && (
                <Stack>
                  <Link href="/user">
                    <Button>Dashboard</Button>
                  </Link>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
        {showClaimButton && !isMinted && (
          <Stack gap="md">
            {account && !hideDashboard && (
              <Link href="/user">
                <Button>Dashboard</Button>
              </Link>
            )}
            <Button onPress={handleClaim}>Mint NFT</Button>
          </Stack>
        )}

        {!account && isMounted && (
          <Stack width="100%">
            <Button onClick={login}>Connect to mint</Button>
          </Stack>
        )}
        {isMinted && (
          <Stack width="100%" flexDirection="column" gap="md">
            <MessageBlock title="Success" variant="success">
              The token is minted
            </MessageBlock>

            <Stack gap="md">
              <Button>
                <Link href={`/user/proof-of-us/t/${tokenId}`}>
                  Go to Proof{' '}
                </Link>
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
