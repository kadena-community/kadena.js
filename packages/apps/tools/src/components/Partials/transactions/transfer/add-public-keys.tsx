import {
  Button,
  FormFieldHeader,
  Stack,
  SystemIcon,
  TextField,
} from '@kadena/react-ui';

import { validatePublicKey } from '@/services/utils/utils';
import { stripAccountPrefix } from '@/utils/string';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';

export interface IAddPublicKeysSection {
  publicKeys: string[];
  setPublicKeys: (keys: string[]) => void;
  deletePubKey: () => void;
  initialPublicKey?: string;
  maxKeysAmount?: number;
}

export const AddPublicKeysSection = ({
  publicKeys,
  setPublicKeys,
  deletePubKey,
  initialPublicKey,
  maxKeysAmount,
}: IAddPublicKeysSection): React.JSX.Element => {
  const { t } = useTranslation('common');

  const [publicKey, setPublicKey] = useState<string>(initialPublicKey || '');
  const [error, setError] = useState<string>('');

  const addPublicKey = (key: string) => {
    const value = stripAccountPrefix(key || '');

    const copyPubKeys = [...publicKeys];
    const isDuplicate = copyPubKeys.includes(value);

    if (isDuplicate) {
      setError(t('Duplicate public key'));
      return;
    }

    copyPubKeys.push(value);
    setPublicKeys(copyPubKeys);
    setPublicKey('');
  };

  const deletePublicKey = (index: number) => {
    const copyPubKeys = [...publicKeys];
    copyPubKeys.splice(index, 1);

    setPublicKeys(copyPubKeys);
    setPublicKey('');
    deletePubKey();
    setError('');
  };

  const renderPubKeys = () => (
    <Stack
      flexDirection={'column'}
      marginBlock={'sm'}
      gap={'sm'}
      flexWrap={'wrap'}
    >
      {publicKeys.map((key, index) => (
        <TextField
          inputFont="code"
          key={`public-key-${index}`}
          id={`public-key-${index}`}
          value={key}
          endAddon={
            <Button
              icon={<SystemIcon.TrashCan />}
              variant="text"
              onPress={() => deletePublicKey(index)}
              aria-label="Delete public key"
              title="Delete public Key"
              color="primary"
              type="button"
            />
          }
        />
      ))}
    </Stack>
  );

  return (
    <section>
      <Stack flexDirection="column" gap="md">
        <FormFieldHeader label={t('Public Key(s)')} />
        {publicKeys.length > 0 ? renderPubKeys() : null}

        <TextField
          id="public-key-input"
          inputFont="code"
          placeholder={t('Enter Public Key')}
          value={publicKey}
          onChange={(e) => {
            setError('');
            setPublicKey(e.target.value);
          }}
          errorMessage={error}
          isInvalid={!!error}
        />
        <Stack flexDirection={'row-reverse'}>
          <Button
            endIcon={<SystemIcon.Plus />}
            onPress={() => {
              const value = publicKey;
              const valid = validatePublicKey(stripAccountPrefix(value || ''));
              if (valid) {
                addPublicKey(value);
              } else {
                setError(t('invalid-pub-key-length'));
              }
            }}
            aria-label="Add public key"
            title="Add Public Key"
            color="primary"
            type="button"
            isDisabled={publicKeys.length >= (maxKeysAmount || 10)}
          >
            {t('Add public key')}
          </Button>
        </Stack>
      </Stack>
    </section>
  );
};
