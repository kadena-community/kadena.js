import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { Confirmation } from '../Confirmation/Confirmation';
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
  const { uploadBackground } = useAvatar();
  const [uploadError, setUploadError] = useState(false);
  const router = useRouter();

  const handleMint = async () => {
    if (!proofOfUs) return;
    setUploadError(false);
    try {
      const result: IUploadResult = await uploadBackground(
        proofOfUs.proofOfUsId,
      );
      //check that upload urls are the same, that we already saved in proofofus (at start of signing)
      if (
        !proofOfUs.manifestUri?.includes(result.metadataUrlUpload) ||
        !proofOfUs.imageUri.includes(result.imageUrlUpload)
      ) {
        console.log({
          result,
          manifestUri: proofOfUs.manifestUri,
          imageUri: proofOfUs.imageUri,
        });
        setUploadError(true);
        window.location.hash = '';
        return;
      }
    } catch (e) {
      console.error('UPLOAD ERR');
      setUploadError(true);
      router.replace(`${getReturnUrl()}`);
      return;
    }
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
