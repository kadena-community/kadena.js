import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../Button';
import type { IDialogProps } from '../Dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';
import { DialogHeaderSubtitle } from './DialogHeaderSubtitle';
import { ModalContent } from './StoryComponents';

type DialogStoryProps = IDialogProps & { title: string; subtitle: string };

const meta: Meta<DialogStoryProps> = {
  title: 'Overlays/Dialog',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: `
A Dialog is a type of modal that is used to display information or prompt the user for input. It is a blocking modal, which means it will trap focus within itself and will not allow the user to interact with the rest of the page until it is closed. It is also dismissable, which means it can be closed by clicking on the close button or pressing the escape key. Dialogs are used for important information that requires the user to take action before continuing.
`,
      },
    },
  },
  argTypes: {
    isOpen: {
      description:
        'Controls whether the dialog is open or closed. If true, the dialog will be open. If false, the dialog will be closed.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    onOpenChange: {
      control: { type: 'function' },
      description:
        'Function that is called when the dialog is opened or closed. It is passed a boolean value that indicates whether the dialog is open or closed.',
      table: {
        type: { summary: 'function' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Title of the dialog.',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
  },
};

export default meta;
type Story = StoryObj<DialogStoryProps>;

export const DialogStory: Story = {
  name: 'Dialog',
  args: {
    title: 'Dialog Title',
    subtitle: 'Dialog subtitle',
  },
  render: ({ title, subtitle, size }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Modal Trigger</Button>
        <Dialog
          isOpen={isOpen}
          size={size}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
        >
          {(state) => (
            <>
              <DialogHeaderSubtitle>{subtitle}</DialogHeaderSubtitle>
              <DialogHeader>{title}</DialogHeader>
              <DialogContent>
                <ModalContent />
              </DialogContent>
              <DialogFooter>
                <Button onClick={state.close}>Close Button</Button>
                <Button onClick={state.close}>Second Close Button</Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </>
    );
  },
};
