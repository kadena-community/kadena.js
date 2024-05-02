import { Button } from '@/components/Button/Button';
import { TextField } from '@/components/TextField/TextField';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { Stack } from '@kadena/react-ui';
import type { FC, FormEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { mobileInputClass } from './style.css';

interface IProps {
  signer?: IProofOfUsSignee;
  onClose: () => void;
}

export const EditorForm: FC<IProps> = ({ signer, onClose }) => {
  const { updateSignee } = useProofOfUs();
  const [error, setError] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;

    const firstElm = formRef.current.querySelectorAll('input')[0];
    if (!firstElm) return;
    firstElm.focus();
  }, [formRef.current]);

  const handleSaveEditor: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    setError('');

    const formData = new FormData(evt.currentTarget);
    const label = formData.get('label');

    await updateSignee({
      name: label,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSaveEditor} ref={formRef}>
      <Stack flexDirection="column" gap="md">
        <TextField
          aria-label="Label"
          placeholder="Label"
          name="label"
          defaultValue={signer?.name}
          maxLength={35}
          className={mobileInputClass}
        />

        {error && <div>{error}</div>}
        <Stack gap="md">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Stack>
      </Stack>
    </form>
  );
};
