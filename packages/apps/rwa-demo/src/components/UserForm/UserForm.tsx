import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import type { IAsset } from '../AssetProvider/AssetProvider';

interface IProps {
  asset?: IAsset;
  trigger: ReactElement;
  onClose?: () => void;
}

export const UserForm: FC<IProps> = ({ trigger, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsRightAsideExpanded(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside
          isOpen={isRightAsideExpanded && isOpen}
          onClose={handleOnClose}
        >
          <RightAsideHeader label="Add User" />
          <RightAsideContent>sd</RightAsideContent>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
