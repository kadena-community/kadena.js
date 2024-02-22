import { Button } from '@/components/Button/Button';
import { TextField } from '@/components/TextField/TextField';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { SocialIcons, getSocial } from '@/utils/getSocial';
import { Stack } from '@kadena/react-ui';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { iconClass } from './style.css';

interface IProps {
  signer?: IProofOfUsSignee;
  onClose: () => void;
}

export const EditorForm: FC<IProps> = ({ signer, onClose }) => {
  const { updateSigner } = useProofOfUs();
  const [error, setError] = useState<string>('');
  const [socialIcon, setSocialIcon] = useState<
    keyof typeof SocialIcons | undefined
  >(undefined);

  useEffect(() => {
    if (!signer) return;
    const socialType = getSocial(signer.socialLink);
    if (!socialType) return;
    setSocialIcon(socialType.icon);
  }, [signer]);

  const handleSaveEditor: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    setError('');

    const formData = new FormData(evt.currentTarget);
    const label = formData.get('label');
    const socialLink = formData.get('socialLink') as string;

    const socialType = getSocial(socialLink);

    if (!socialType && socialLink) {
      setError(`${socialLink} is not a valid social link`);
      return;
    }
    setSocialIcon(socialType?.icon);

    updateSigner({
      name: label,
      socialLink,
    });

    onClose();
  };

  const handleSocialChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const socialLink = evt.currentTarget.value;
    const socialType = getSocial(socialLink);

    setSocialIcon(socialType?.icon);
  };

  const renderIcon = (str: keyof typeof SocialIcons) => {
    const Icon = SocialIcons[str];
    if (Icon) return <Icon />;
    return null;
  };

  return (
    <form onSubmit={handleSaveEditor}>
      <Stack flexDirection="column" gap="md">
        <TextField
          aria-label="Label"
          placeholder="Label"
          name="label"
          defaultValue={signer?.name}
        />
        <Stack position="relative">
          <TextField
            onChange={handleSocialChange}
            aria-label="Social Media Uri"
            placeholder="Social Media Uri"
            name="socialLink"
            defaultValue={signer?.socialLink}
          />
          {socialIcon && (
            <span className={iconClass}>{renderIcon(socialIcon)}</span>
          )}
        </Stack>
        {error && <div>{error}</div>}
        <Stack gap="md">
          <Button
            variant="secondary"
            onPress={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Stack>
      </Stack>
    </form>
  );
};
