import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { Text } from '../Typography';

import { useModal } from './ModalProvider';

import React, { FC } from 'react';

const ModalContent: FC = () => {
  return (
    <>
      <Stack direction="column" spacing="lg">
        <Card fullWidth={true}>
          <h4>Getting Started is Simple</h4>
          <Text>
            Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
            chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
            Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
            sesame snaps marzipan gummies marshmallow topping cake apple pie
            pudding. Toffee sweet halvah cake liquorice chupa chups sugar plum.
            Tootsie roll marshmallow gummi bears apple pie cake jujubes pudding.
            Halvah apple pie tiramisu bear claw caramels cookie dessert cotton
            candy. Jelly-o sweet sugar plum topping topping jujubes powder
            shortbread lemon drops. Chupa chups muffin oat cake chupa chups
            cookie liquorice oat cake tootsie roll. Gingerbread dessert donut
            pastry muffin powder sugar plum. Chupa chups bonbon topping jelly
            beans pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
            bonbon tart bonbon.
          </Text>
        </Card>
        <Card fullWidth={true}>
          <h4>Getting Started is Simple</h4>

          <Text>
            Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
            chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
            Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
            sesame snaps marzipan gummies marshmallow topping cake apple pie
            pudding. Toffee sweet halvah cake liquorice chupa chups sugar plum.
            Tootsie roll marshmallow gummi bears apple pie cake jujubes pudding.
            Halvah apple pie tiramisu bear claw caramels cookie dessert cotton
            candy. Jelly-o sweet sugar plum topping topping jujubes powder
            shortbread lemon drops. Chupa chups muffin oat cake chupa chups
            cookie liquorice oat cake tootsie roll. Gingerbread dessert donut
            pastry muffin powder sugar plum. Chupa chups bonbon topping jelly
            beans pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
            bonbon tart bonbon.
          </Text>
          <Text>
            Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
            chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
            Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
            sesame snaps marzipan gummies marshmallow topping cake apple pie
            pudding. Toffee sweet halvah cake liquorice chupa chups sugar plum.
            Tootsie roll marshmallow gummi bears apple pie cake jujubes pudding.
            Halvah apple pie tiramisu bear claw caramels cookie dessert cotton
            candy. Jelly-o sweet sugar plum topping topping jujubes powder
            shortbread lemon drops. Chupa chups muffin oat cake chupa chups
            cookie liquorice oat cake tootsie roll. Gingerbread dessert donut
            pastry muffin powder sugar plum. Chupa chups bonbon topping jelly
            beans pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
            bonbon tart bonbon.
          </Text>
          <Text>
            Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
            chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
            Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
            sesame snaps marzipan gummies marshmallow topping cake apple pie
            pudding. Toffee sweet halvah cake liquorice chupa chups sugar plum.
            Tootsie roll marshmallow gummi bears apple pie cake jujubes pudding.
            Halvah apple pie tiramisu bear claw caramels cookie dessert cotton
            candy. Jelly-o sweet sugar plum topping topping jujubes powder
            shortbread lemon drops. Chupa chups muffin oat cake chupa chups
            cookie liquorice oat cake tootsie roll. Gingerbread dessert donut
            pastry muffin powder sugar plum. Chupa chups bonbon topping jelly
            beans pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
            bonbon tart bonbon.
          </Text>
          <Text>
            Dessert gummies pie biscuit chocolate bar cheesecake. Toffee
            chocolate bar ice cream cake jujubes pudding fruitcake marzipan.
            Donut sweet oat cake dragée candy cupcake biscuit. Carrot cake
            sesame snaps marzipan gummies marshmallow topping cake apple pie
            pudding. Toffee sweet halvah cake liquorice chupa chups sugar plum.
            Tootsie roll marshmallow gummi bears apple pie cake jujubes pudding.
            Halvah apple pie tiramisu bear claw caramels cookie dessert cotton
            candy. Jelly-o sweet sugar plum topping topping jujubes powder
            shortbread lemon drops. Chupa chups muffin oat cake chupa chups
            cookie liquorice oat cake tootsie roll. Gingerbread dessert donut
            pastry muffin powder sugar plum. Chupa chups bonbon topping jelly
            beans pastry. Soufflé chupa chups wafer fruitcake lollipop apple pie
            bonbon tart bonbon.
          </Text>
        </Card>
      </Stack>
    </>
  );
};

export const Content: FC = () => {
  const { renderModal } = useModal();

  return (
    <>
      <Button onClick={() => renderModal(<ModalContent />)} title="openModal">
        Open modal
      </Button>
    </>
  );
};
