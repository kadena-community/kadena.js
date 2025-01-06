import type { IRegisterIdentityProps } from '@/services/registerIdentity';

import { Button } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const InvestorBatchForm: FC<IProps> = ({ onClose, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { handleSubmit } = useForm<IRegisterIdentityBatchProps>({
    defaultValues: {
      select: [],
    },
  });

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

  const onSubmit = async (data: IRegisterIdentityBatchProps) => {
    const d = document.querySelectorAll('#select');

    const filled = [].filter.call(d, function (el) {
      return el.checked;
    });

    [].map.call(filled, function (el) {
      console.log(el.value);
    });

    console.log(12, { data });
    console.log(filled);
    //await submit(data);
    //handleOnClose();
  };

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Batch add investors" />
            <RightAsideContent>
              <DragNDropCSV />
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button type="submit">Add investors</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
