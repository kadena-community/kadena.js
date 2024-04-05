import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { MessageBlock } from '@/components/MessageBlock/MessageBlock';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { useTokens } from '@/hooks/tokens';
import { env } from '@/utils/env';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { Stack } from '@kadena/react-ui';
import { isAfter, isBefore } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useMemo } from 'react';

interface IProps {
  data: IProofOfUsTokenMeta;
  eventId: string;
  isMinted: boolean;
  handleIsMinted: Dispatch<SetStateAction<boolean>>;
}

export const ScanAttendanceEvent: FC<IProps> = ({
  data,
  eventId,
  isMinted,
}) => {
  const { claim } = useClaimAttendanceToken();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { account, isMounted, login } = useAccount();
  const { addMintingData, tokens } = useTokens();
  const { doSubmit, isStatusLoading } = useSubmit();

  const tokenId = useMemo(() => {
    const token = tokens?.find((t) => t.info?.uri === data.manifestUri);
    return token?.id;
  }, [tokens, data]);

  const getProof = (
    data: IProofOfUsTokenMeta,
    transaction: string,
  ): IProofOfUsData => {
    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());

    const proof: IProofOfUsData = {
      proofOfUsId: data.properties.eventId,
      type: 'attendance',
      requestKey: tx.hash,
      title: data.name,
      isReadyToSign: false,
      mintStatus: 'init',
      imageUri: data.image,
      date: Date.now(),
      eventId: data.properties.eventId,
      eventName: data.properties.eventName,
      backgroundColor: data.properties.avatar?.backgroundColor,
      tx: transaction,
      status: 4,
      manifestUri: data.manifestUri,
    };

    return proof;
  };

  const createProof = async () => {
    const transaction = searchParams.get('transaction') ?? '';
    if (!transaction || !account) return;

    const proof = getProof(data, transaction);
    await addMintingData(proof);
    await doSubmit(transaction, proof);
  };

  useEffect(() => {
    createProof();
  }, [account, searchParams]);

  const handleClaim = async () => {
    const transaction = await claim(eventId);
    if (!transaction || !account) return;

    const bufferedTx = Buffer.from(JSON.stringify(transaction)).toString(
      'base64',
    );

    router.push(
      `${
        process.env.NEXT_PUBLIC_WALLET_URL
      }sign?transaction=${bufferedTx}&chainId=${
        env.CHAINID
      }&returnUrl=${getReturnUrl()}
      `,
    );
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
                {!isMinted && account && (
                  <Stack>
                    <Link href="/user">
                      <Button>Go to dashboard</Button>
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
              {!isMinted && account && (
                <Stack>
                  <Link href="/user">
                    <Button>Go to dashboard</Button>
                  </Link>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
        {showClaimButton && !isMinted && (
          <Stack gap="md">
            {account && (
              <Link href="/user">
                <Button>Go to dashboard</Button>
              </Link>
            )}
            <Button onPress={handleClaim}>Claim NFT</Button>
          </Stack>
        )}

        {!account && isMounted && (
          <Stack width="100%">
            <Button onClick={login}>Login to mint</Button>
          </Stack>
        )}
        {isMinted && (
          <Stack width="100%" flexDirection="column" gap="md">
            <MessageBlock title="Success" variant="success">
              The token is minted
            </MessageBlock>

            <Stack gap="md">
              <Button>
                <Link href="/user">Go to dashboard</Link>
              </Button>

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
