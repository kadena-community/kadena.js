import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { AssetStepperForm } from './AssetStepperForm';

interface IProps {
  asset?: IAsset;
  trigger: ReactElement;
  onClose?: () => void;
}

export const AssetFormScreen: FC<IProps> = ({ trigger, onClose }) => {
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
        <RightAside isOpen={true} onClose={handleOnClose}>
          <RightAsideHeader label="Add Asset" />
          <RightAsideContent>
            <AssetStepperForm handleDone={handleOnClose} />
          </RightAsideContent>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
