import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import { MintingCheck } from '@/components/MintingCheck/MintingCheck';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useTokens } from '@/hooks/tokens';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    requestKey: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  const { tokens, getToken } = useTokens();
  const [token, setToken] = useState<IToken>();
  useEffect(() => {
    const result = getToken(params.requestKey);
    if (!result) return;

    setToken(result);
  }, [params.requestKey, tokens, getToken]);

  return (
    <LoginBoundry>
      <UserLayout>
        <ProofOfUsProvider proofOfUsId={token?.proofOfUsId}>
          <ScreenHeight>{token && <MintingCheck token={token} />}</ScreenHeight>
        </ProofOfUsProvider>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const requestKey = `${ctx.query.requestKey}`;

  return {
    props: { params: { requestKey } },
  };
};

export default Page;
