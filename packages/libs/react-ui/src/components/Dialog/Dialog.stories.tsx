import { Button } from '@components/Button';
import { Dialog } from '@components/Dialog';
import type { IModalProps } from '@components/Modal';
import { Stack } from '@components/Stack';
import { Text } from '@components/Typography';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<{ title?: string } & IModalProps> = {
  title: 'Overlays/Dialog',
  parameters: {
    docs: {
      description: {
        component: `
A Dialog is a type of modal that is used to display information or prompt the user for input. It is a blocking modal, which means it will trap focus within itself and will not allow the user to interact with the rest of the page until it is closed. It is also dismissable, which means it can be closed by clicking on the close button or pressing the escape key. Dialogs are used for important information that requires the user to take action before continuing.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IModalProps>;

export const DialogStory: Story = {
  name: 'Dialog',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Modal Trigger</Button>
        <Dialog
          isOpen={isOpen}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
          title="Dialog Title"
        >
          {(state) => (
            <Stack direction="column" gap="$6" alignItems="flex-end">
              <Text>
                Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
                Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
                sesame snaps marzipan gummies marshmallow topping cake apple pie
                pudding. Toffee sweet halvah cake liquorice chupa chups sugar
                plum. Tootsie roll marshmallow gummi bears apple pie cake
                jujubes pudding. Halvah apple pie tiramisu bear claw caramels
                cookie dessert cotton candy. Jelly-o sweet sugar plum topping
                topping jujubes powder shortbread lemon drops. Chupa chups
                muffin oat cake chupa chups cookie liquorice oat cake tootsie
                roll. Gingerbread dessert donut pastry muffin powder sugar plum.
                Chupa chups bonbon topping jelly beans pastry. Soufflé chupa
                chups wafer fruitcake lollipop apple pie bonbon tart bonbon.
              </Text>
              <Button onClick={state.close}>Close Button</Button>
            </Stack>
          )}
        </Dialog>
      </>
    );
  },
};
