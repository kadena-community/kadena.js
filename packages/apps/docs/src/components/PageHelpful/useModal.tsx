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

import React, { useCallback, useState } from 'react';

interface IUseModalHookResult {
  renderModalComponent(): void;
  comment: string;
}

export default function useModal(editLink?: string): IUseModalHookResult {
  const { renderModal, clearModal } = useUIModal();
  const [comment, setComment] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setComment(e.target.value);
  }

  function handleSendFeedback(): void {
    clearModal();
  }

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
              <EditPage editLink="hello/world" />
            </Box>
          )}
          <Text>
            If you have any specific feedback about this page. <br />
            Please provide a comment.
          </Text>
          <textarea
            name="feedback"
            className={textAreaClass}
            onChange={handleChange}
          ></textarea>
          <Button variant="primary" onClick={handleSendFeedback}>
            Send Feedback
          </Button>
        </Stack>
      </div>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLink]);

  return {
    renderModalComponent,
    comment,
  };
}
