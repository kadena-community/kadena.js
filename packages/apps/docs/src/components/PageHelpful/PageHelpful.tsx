import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  Text,
  ToggleButton,
} from '@kadena/kode-ui';
import { MonoThumbDownOffAlt, MonoThumbUpOffAlt } from '@kadena/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import { modalWrapperClass, textAreaClass } from './styles.css';
import usePageHelpful from './usePageHelpful';

interface IProps {
  editLink?: string;
}

export const PageHelpful: FC<IProps> = ({ editLink }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const { handlePageHelpful, handlePageNotHelpful, isPageHelpful } =
    usePageHelpful(setIsOpen);

  const closeModal = (): void => {
    analyticsEvent(EVENT_NAMES['click:page_helpful'], {
      page_path: pathname,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_page_helpful: 'no',
      comment: inputRef?.current?.value,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Stack flexDirection="column" gap="sm">
        <Text bold as="p">
          Was this page helpful?
        </Text>
        <Stack gap="xs">
          <ToggleButton
            icon={<MonoThumbUpOffAlt />}
            onPress={handlePageHelpful}
            title="Useful"
            aria-label="Useful"
            variant="positive"
            isSelected={isPageHelpful === 'up'}
          />
          <ToggleButton
            icon={<MonoThumbDownOffAlt />}
            onPress={handlePageNotHelpful}
            title="Not useful"
            aria-label="Not useful"
            variant="negative"
            isSelected={isPageHelpful === 'down'}
          />
        </Stack>
      </Stack>

      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        <DialogHeader>Thank you for your feedback!</DialogHeader>
        <DialogContent>
          <div className={modalWrapperClass}>
            <Stack gap="md" flexDirection="column">
              {editLink}
              {editLink ? (
                <Stack gap="sm" flexDirection="row">
                  <Text>
                    Would you like to contribute to this page by{' '}
                    <Link href={editLink} target="_blank">
                      editing
                    </Link>{' '}
                    it
                  </Text>
                </Stack>
              ) : null}
              <Text variant="body">
                If you have any specific feedback about this page. <br />
                Please provide a comment.
              </Text>
              <textarea
                ref={inputRef}
                name="feedback"
                className={textAreaClass}
              ></textarea>
              <Button onPress={closeModal}>Send Feedback</Button>
            </Stack>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
