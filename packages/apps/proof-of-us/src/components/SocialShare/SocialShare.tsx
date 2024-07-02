import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import type { EVENT_NAMES } from '@/utils/analytics';
import { analyticsEvent } from '@/utils/analytics';
import { Stack } from '@kadena/kode-ui';
import {
  MonoAddLink,
  MonoCheckCircle,
  MonoIosShare,
  MonoLogoLinkedin,
  MonoLogoX,
  MonoThumbUpOffAlt,
} from '@kadena/react-icons';
import type { FC, MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { copyClass, listClass } from './style.css';

interface IProps {
  data: IProofOfUsTokenMeta;
  tokenId?: string;
}

export const SocialShare: FC<IProps> = ({ data, tokenId }) => {
  const label = data.name;
  const text = `${data.name} | Proof Of Us #devworld2024`;
  const title = `${data?.name} | Proof Of Us (Powered by Kadena)`;
  const twitterTitle = `${data?.name} @kadena_io on @devworld_conf #devworldkadena`;
  const url = `${process.env.NEXT_PUBLIC_URL}/share/${tokenId}`;

  const shareDetails = { url, title, text, label };
  const [isShown, setIsShown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => {
      setIsCopied((currentIsCopied) => !currentIsCopied);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  const onShare = (type: string, url: string, title: string) => {
    const analyticsType = `clicked_social_${type}` as keyof typeof EVENT_NAMES;
    analyticsEvent(analyticsType, {
      url,
      title,
    });
  };

  const onCopyToClipboard = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => setIsCopied(true))
        .catch(console.error);

      onShare('copy', url, title);
    }
  };

  const shareNative = async () => {
    try {
      await navigator
        .share(shareDetails)
        .then(() =>
          console.log('Hooray! Your content was shared to the world'),
        );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
      console.log(`Oops! I couldn't share to the world because: ${error}`);
    }
  };

  const shareFallback = async () => {
    setIsShown((v) => !v);
  };

  const handleClick = async (): Promise<void> => {
    if (
      navigator &&
      navigator.canShare &&
      (navigator.canShare() || !navigator.canShare())
    ) {
      await shareNative();
    } else {
      await shareFallback();
    }
  };

  const onFacebookShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'facebook-share-dialog',
      'width=800,height=600',
    );

    onShare('facebook', url, title);
  };

  const headerModal = (
    <Stack display="flex" justifyContent="space-between">
      <div>Share</div>
      {isCopied ? (
        <Stack>
          Copied <MonoCheckCircle className={copyClass} />
        </Stack>
      ) : (
        ''
      )}
    </Stack>
  );

  return (
    <div>
      {isShown ? (
        <Modal label={headerModal} onClose={() => setIsShown(false)}>
          <ul className={listClass}>
            <li>
              <IconButton onClick={onFacebookShare}>
                <MonoThumbUpOffAlt width="40" height="40" />
              </IconButton>
            </li>
            <li>
              <a
                onClick={() => onShare('twitter', url, title)}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/intent/tweet?url=${url}&text=${twitterTitle}`}
              >
                <MonoLogoX width="40" height="40" />
              </a>
            </li>
            <li>
              <a
                onClick={() => onShare('linkedin', url, title)}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://linkedin.com/share/?url=${url}&text=${title}`}
              >
                <MonoLogoLinkedin width="40" height="40" />
              </a>
            </li>
            <li>
              <IconButton onClick={onCopyToClipboard}>
                <MonoAddLink width="40" height="40" />
              </IconButton>
            </li>
          </ul>
          <Stack marginBlockStart="md">
            <Button variant="secondary" onClick={() => setIsShown(false)}>
              Cancel
            </Button>
          </Stack>
        </Modal>
      ) : null}
      <IconButton aria-label="share to the socials" onClick={handleClick}>
        <MonoIosShare />
      </IconButton>
    </div>
  );
};
