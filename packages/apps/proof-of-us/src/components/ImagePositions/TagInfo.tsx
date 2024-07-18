import { deviceColors } from '@/styles/tokens.css';
import { MonoClose, MonoInfo } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { Heading } from '../Typography/Heading';
import { Text } from '../Typography/Text';
import { tagInfoClass, tagInfoWrapperClass, textStyle } from './style.css';

interface IProps {
  handleClose: () => void;
}

export const TagInfo: FC<IProps> = ({ handleClose }) => {
  return (
    <Stack className={tagInfoWrapperClass} borderRadius="lg">
      <div className={tagInfoClass}>
        <Heading as="h6">
          <Stack
            alignItems="center"
            gap="sm"
            style={{ color: deviceColors.orange }}
          >
            <MonoInfo fontSize="sm" /> Tag your photo
            <Stack flex={1} />
            <IconButton onClick={handleClose}>
              <MonoClose fontSize="sm" />
            </IconButton>
          </Stack>
        </Heading>
        <Text className={textStyle}>Tap on the photo to tag yourself</Text>
      </div>
    </Stack>
  );
};
