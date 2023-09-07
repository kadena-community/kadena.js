import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useModal as useUIModal,
} from '@kadena/react-ui';

import { EditPage } from '../BottomPageSection/components/EditPage';

import { modalWrapperClass, textAreaClass } from './styles.css';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { usePathname } from 'next/navigation';
import React, { useCallback, useRef } from 'react';

interface IUseModalHookResult {
  renderModalComponent: () => void;
  comment?: string;
}

export default function useModal(editLink?: string): IUseModalHookResult {
  const { renderModal, clearModal } = useUIModal();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  const closeModal = (): void => {
    analyticsEvent(EVENT_NAMES['click:page_helpful'], {
      pagePath: pathname,
      isPageHelpful: 'no',
      comment: inputRef?.current?.value,
    });
    clearModal();
  };

  const renderModalComponent = useCallback((): void => {
    renderModal(
      <div className={modalWrapperClass}>
        <Stack gap="$4" direction="column">
          <Heading as="h4" variant="h4">
            Thank you for your feedback!
          </Heading>
          {editLink && (
            <Box>
              <Text>
                Would you like to contribute to this page by editing it?
              </Text>
              <EditPage editLink={editLink} />
            </Box>
          )}
          <Text>
            If you have any specific feedback about this page. <br />
            Please provide a comment.
          </Text>
          <textarea
            name="feedback"
            className={textAreaClass}
            ref={inputRef}
          ></textarea>
          <Button variant="primary" onClick={closeModal}>
            Send Feedback
          </Button>
        </Stack>
      </div>,
      undefined,
      closeModal,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLink]);

  return {
    renderModalComponent,
  };
}
