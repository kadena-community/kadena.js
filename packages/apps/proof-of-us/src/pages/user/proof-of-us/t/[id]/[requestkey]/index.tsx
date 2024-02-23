import { LoginBoundry } from '@/components/LoginBoundry/LoginBoundry';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useListen } from '@/hooks/listen';
import { SubmitStatus } from '@/hooks/submit';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
    requestKey: string;
  };
}

const Page: NextPage<IProps> = ({ params }) => {
  const { listen, status, result } = useListen();
  const router = useRouter();

  const init = async () => {
    await listen(params.requestKey);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (status === SubmitStatus.SUCCESS) {
      router.replace(`/user/proof-of-us/t/${params.id}`);
    }
  }, [status]);

  return (
    <LoginBoundry>
      <UserLayout>
        <div>status: {JSON.stringify(status)}</div>
        <div>result: {JSON.stringify(result)}</div>
      </UserLayout>
    </LoginBoundry>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: IProps }> => {
  const id = `${ctx.query.id}`;
  const requestKey = `${ctx.query.requestkey}`;

  return {
    props: { params: { id, requestKey } },
  };
};

export default Page;
