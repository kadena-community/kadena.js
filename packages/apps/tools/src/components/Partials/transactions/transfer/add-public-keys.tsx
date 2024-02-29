import { Button, Stack, SystemIcon } from '@kadena/react-ui';

import { HoverTag, PublicKeyField } from '@/components/Global';
import { validatePublicKey } from '@/services/utils/utils';
import { stripAccountPrefix } from '@/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

export interface IAddPublicKeysSection {
  publicKeys: string[];
  setPublicKeys: (keys: string[]) => void;
  deletePubKey: () => void;
  initialPublicKey?: string;
}

const schema = z.object({
  pubKey: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export const AddPublicKeysSection = ({
  publicKeys,
  setPublicKeys,
  deletePubKey,
  initialPublicKey,
}: IAddPublicKeysSection): React.JSX.Element => {
  const { t } = useTranslation('common');

  const {
    formState: { errors },
    clearErrors,
    setError,
    getValues,
    setValue,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pubKey: initialPublicKey ?? '',
    },
  });

  const addPublicKey = () => {
    const value = stripAccountPrefix(getValues('pubKey') || '');

    const copyPubKeys = [...publicKeys];
    const isDuplicate = copyPubKeys.includes(value);

    if (isDuplicate) {
      setError('pubKey', { message: t('Duplicate public key') });
      return;
    }

    copyPubKeys.push(value);
    setPublicKeys(copyPubKeys);
    setValue('pubKey', '');
  };

  const deletePublicKey = (index: number) => {
    const copyPubKeys = [...publicKeys];
    copyPubKeys.splice(index, 1);

    setPublicKeys(copyPubKeys);
    setValue('pubKey', '');
    deletePubKey();
    clearErrors('pubKey');
  };

  const renderPubKeys = () => (
    <Stack
      flexDirection={'column'}
      marginBlock={'sm'}
      gap={'sm'}
      flexWrap={'wrap'}
    >
      {publicKeys.map((key, index) => (
        <HoverTag
          key={`public-key-${key}`}
          value={key}
          onIconButtonClick={() => {
            deletePublicKey(index);
          }}
          icon="TrashCan"
          maskOptions={{ headLength: 4, character: '.' }}
        />
      ))}
    </Stack>
  );

  return (
    <section>
      <Stack flexDirection="column" gap="md">
        <Controller
          name="pubKey"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <PublicKeyField
              {...field}
              onChange={(e) => {
                field.onChange(e);
                clearErrors('pubKey');
              }}
              errorMessage={errors?.pubKey?.message}
              isInvalid={!!errors.pubKey}
              endAddon={
                <Button
                  icon={<SystemIcon.Plus />}
                  variant="text"
                  onPress={() => {
                    const value = getValues('pubKey');
                    const valid = validatePublicKey(
                      stripAccountPrefix(value || ''),
                    );
                    if (valid) {
                      addPublicKey();
                    } else {
                      setError('pubKey', {
                        type: 'custom',
                        message: t('invalid-pub-key-length'),
                      });
                    }
                  }}
                  aria-label="Add public key"
                  title="Add Public Key"
                  color="primary"
                  type="button"
                />
              }
            />
          )}
        />

        {publicKeys.length > 0 ? renderPubKeys() : null}
      </Stack>
    </section>
  );
};
