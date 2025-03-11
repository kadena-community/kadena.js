'use client';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CreateAssetPage = () => {
  const { setAsset, addExistingAsset } = useAsset();
  const { isMounted, account } = useAccount();
  const [isFound, setIsFound] = useState<boolean | undefined>(undefined);
  const router = useRouter();

  const { namespace, contractName } = useParams();

  useEffect(() => {
    if (!namespace || !contractName) return;

    const asset = addExistingAsset(`${namespace}.${contractName}`);
    if (!asset) {
      setIsFound(false);
      return;
    }
    setTimeout(() => {
      setAsset(asset);
    }, 3000);
    setIsFound(true);
  }, [namespace, contractName]);

  useEffect(() => {
    if (isMounted && !account) {
      router.replace('/login');
    }
  }, [account, isMounted]);

  if (isFound === undefined) return null;

  return (
    <Stack
      width="100%"
      alignItems="center"
      flexDirection="column"
      gap="md"
      marginBlockStart="xxxl"
    >
      <Heading>
        {isFound ? 'The asset is found' : 'The asset is Not found'}
      </Heading>
      <Text>You will be redirected to the dashboard</Text>
    </Stack>
  );
};
export default CreateAssetPage;
