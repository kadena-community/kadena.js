import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { Stack } from '@kadena/kode-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { Modal } from '../Modal/Modal';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { LoadingStatus } from '../Status/LoadingStatus';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = () => {
  const { proofOfUs, signees, updateSignee, resetSignatures } = useProofOfUs();
  const { doSubmit, transaction } = useSubmit();
  const [uploadError, setUploadError] = useState(false);
  const router = useRouter();

  const handleMint = async () => {
    if (!proofOfUs) return;
    setUploadError(false);

    try {
      await updateSignee({ signerStatus: 'success' }, true);
      await doSubmit();
    } catch (e) {
      console.error('SUBMIT ERR');
      setUploadError(true);
      router.replace(`${getReturnUrl()}`);
      return;
    }
  };

  useEffect(() => {
    if (!proofOfUs || !signees || !transaction) return;

    if (!proofOfUs.tx) {
      throw new Error('no tx is found');
    }
    handleMint();
  }, [proofOfUs?.tx, signees?.length, transaction]);

  if (!proofOfUs) return;

  return (
    <ScreenHeight>
      {uploadError && (
        <Modal label="Upload error" onClose={() => {}}>
          <Stack paddingBlockEnd="md">
            Something went wrong with the upload. Hashes do not align. Please
            try again
          </Stack>
          <Stack gap="md">
            <Button variant="secondary" onPress={resetSignatures}>
              Reset Signers
            </Button>

            <Button>
              <Link href="/user">Go to dashboard</Link>
            </Button>
          </Stack>
        </Modal>
      )}
      <LoadingStatus />
      <ListSignees />
    </ScreenHeight>
  );
};
