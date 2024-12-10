import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import type { IAsset } from '../AssetProvider/AssetProvider';
import { StepperAssetForm } from './StepperAssetForm';

interface IProps {
  asset?: IAsset;
  trigger: ReactElement;
  onClose?: () => void;
}

export const AssetForm: FC<IProps> = ({ trigger, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

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
          <RightAsideHeader label="Add Asset" />
          <RightAsideContent>
            <StepperAssetForm />
          </RightAsideContent>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
