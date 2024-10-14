'use client';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { IconButton } from '@/components/IconButton/IconButton';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { ScanAttendanceEvent } from '@/features/ScanAttendanceEvent/ScanAttendanceEvent';
import { useAccount } from '@/hooks/account';
import { useGetAttendanceToken } from '@/hooks/data/getAttendanceToken';
import { useHasMintedAttendaceToken } from '@/hooks/data/hasMintedAttendaceToken';
import { MonoLogin, MonoLogout } from '@kadena/kode-icons';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const SPIREKEYNFTID = process.env.NEXT_PUBLIC_SPIREKEYNEFTID ?? '';

const Page: FC = () => {
  const [isMinted, setIsMinted] = useState(false);
  const { account, isMounted, login, logout } = useAccount();
  const { data, isLoading, error } = useGetAttendanceToken(SPIREKEYNFTID);

  const { hasMinted } = useHasMintedAttendaceToken();

  const init = async () => {
    const result = await hasMinted(SPIREKEYNFTID, account?.accountName);
    setIsMinted(result);
  };

  useEffect(() => {
    init();
  }, [account]);

  if (!SPIREKEYNFTID) {
    console.warn('there is no spirekey nft found');
    return;
  }

  if (!isMounted || !data) return null;

  return (
    <UserLayout>
      <ScreenHeight>
        <ProofOfUsProvider proofOfUsId={SPIREKEYNFTID}>
          <TitleHeader
            label="Kadena Spirekey Launch NFT"
            Append={() =>
              account ? (
                <Confirmation
                  text="Are you sure you want to logout?"
                  action={logout}
                >
                  <IconButton title="Logout">
                    <MonoLogout />
                  </IconButton>
                </Confirmation>
              ) : (
                <IconButton title="Login" onClick={login}>
                  <MonoLogin />
                </IconButton>
              )
            }
          />
          {isLoading && <MainLoader />}
          {error && <div>...error</div>}
          <ScanAttendanceEvent
            hideDashboard
            data={data}
            eventId={SPIREKEYNFTID}
            isMinted={isMinted}
            handleIsMinted={setIsMinted}
          />
        </ProofOfUsProvider>
      </ScreenHeight>
    </UserLayout>
  );
};

export default Page;
