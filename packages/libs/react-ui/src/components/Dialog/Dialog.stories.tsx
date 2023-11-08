import { Button } from '@components/Button';
import { Dialog, IDialogProps } from '@components/Dialog';
import { Text } from '@components/Typography';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<IDialogProps> = {
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
  },
};

export default meta;
type Story = StoryObj<IDialogProps>;

export const DialogStory: Story = {
  name: 'Dialog',
  args: {
    title: 'Dialog Title',
  },
  render: ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Modal Trigger</Button>
        <Dialog.Root
          isOpen={isOpen}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
        >
          {(state) => (
            <>
              <Dialog.Header>{title}</Dialog.Header>
              <Dialog.Content>
                <Text>
                  Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                  chocolate bar ice cream cake jujubes pudding fruitcake
                  marzipan. Donut sweet oat cake dragée candy cupcake biscuit.
                  Carrot cake sesame snaps marzipan gummies marshmallow topping
                  cake apple pie pudding. Toffee sweet halvah cake liquorice
                  chupa chups sugar plum. Tootsie roll marshmallow gummi bears
                  apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
                  claw caramels cookie dessert cotton candy. Jelly-o sweet sugar
                  plum topping topping jujubes powder shortbread lemon drops.
                  Chupa chups muffin oat cake chupa chups cookie liquorice oat
                  cake tootsie roll. Gingerbread dessert donut pastry muffin
                  powder sugar plum. Chupa chups bonbon topping jelly beans
                  pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
                  bonbon tart bonbon.
                </Text>
                <Text>
                  Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                  chocolate bar ice cream cake jujubes pudding fruitcake
                  marzipan. Donut sweet oat cake dragée candy cupcake biscuit.
                  Carrot cake sesame snaps marzipan gummies marshmallow topping
                  cake apple pie pudding. Toffee sweet halvah cake liquorice
                  chupa chups sugar plum. Tootsie roll marshmallow gummi bears
                  apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
                  claw caramels cookie dessert cotton candy. Jelly-o sweet sugar
                  plum topping topping jujubes powder shortbread lemon drops.
                  Chupa chups muffin oat cake chupa chups cookie liquorice oat
                  cake tootsie roll. Gingerbread dessert donut pastry muffin
                  powder sugar plum. Chupa chups bonbon topping jelly beans
                  pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
                  bonbon tart bonbon.
                </Text>
                <Text>
                  Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                  chocolate bar ice cream cake jujubes pudding fruitcake
                  marzipan. Donut sweet oat cake dragée candy cupcake biscuit.
                  Carrot cake sesame snaps marzipan gummies marshmallow topping
                  cake apple pie pudding. Toffee sweet halvah cake liquorice
                  chupa chups sugar plum. Tootsie roll marshmallow gummi bears
                  apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
                  claw caramels cookie dessert cotton candy. Jelly-o sweet sugar
                  plum topping topping jujubes powder shortbread lemon drops.
                  Chupa chups muffin oat cake chupa chups cookie liquorice oat
                  cake tootsie roll. Gingerbread dessert donut pastry muffin
                  powder sugar plum. Chupa chups bonbon topping jelly beans
                  pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
                  bonbon tart bonbon.
                </Text>
                <Text>
                  Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                  chocolate bar ice cream cake jujubes pudding fruitcake
                  marzipan. Donut sweet oat cake dragée candy cupcake biscuit.
                  Carrot cake sesame snaps marzipan gummies marshmallow topping
                  cake apple pie pudding. Toffee sweet halvah cake liquorice
                  chupa chups sugar plum. Tootsie roll marshmallow gummi bears
                  apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
                  claw caramels cookie dessert cotton candy. Jelly-o sweet sugar
                  plum topping topping jujubes powder shortbread lemon drops.
                  Chupa chups muffin oat cake chupa chups cookie liquorice oat
                  cake tootsie roll. Gingerbread dessert donut pastry muffin
                  powder sugar plum. Chupa chups bonbon topping jelly beans
                  pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
                  bonbon tart bonbon.
                </Text>
                <Text>
                  Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
                  chocolate bar ice cream cake jujubes pudding fruitcake
                  marzipan. Donut sweet oat cake dragée candy cupcake biscuit.
                  Carrot cake sesame snaps marzipan gummies marshmallow topping
                  cake apple pie pudding. Toffee sweet halvah cake liquorice
                  chupa chups sugar plum. Tootsie roll marshmallow gummi bears
                  apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
                  claw caramels cookie dessert cotton candy. Jelly-o sweet sugar
                  plum topping topping jujubes powder shortbread lemon drops.
                  Chupa chups muffin oat cake chupa chups cookie liquorice oat
                  cake tootsie roll. Gingerbread dessert donut pastry muffin
                  powder sugar plum. Chupa chups bonbon topping jelly beans
                  pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
                  bonbon tart bonbon.
                </Text>
              </Dialog.Content>
              <Dialog.Footer>
                <Button onClick={state.close}>Close Button</Button>
                <Button onClick={state.close}>Close Button</Button>
              </Dialog.Footer>
            </>
          )}
        </Dialog.Root>
      </>
    );
  },
};
