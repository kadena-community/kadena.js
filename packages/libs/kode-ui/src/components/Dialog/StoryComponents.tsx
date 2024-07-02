import type { FC } from 'react';
import React from 'react';
import { Stack } from '../Layout';
import { Link } from '../Link';
import { Text } from '../Typography';

export const ModalContent: FC = () => {
  return (
    <Stack flexDirection="column" gap="sm">
      <Text>
        When tabbing through links in a modal, the focus should stay in the
        modal and not go to the links on the page itself.
      </Text>
      <ul>
        <li>
          <Link href="#">link 1</Link>
        </li>
        <li>
          <Link href="#">link 2</Link>
        </li>
        <li>
          <Link href="#">link 3</Link>
        </li>
      </ul>
      <Text>
        Dessert gummies pie biscuit chocolate bar cheesecake. Toffee chocolate
        bar ice cream cake jujubes pudding fruitcake marzipan. Donut sweet oat
        cake dragée candy cupcake biscuit. Carrot cake sesame snaps marzipan
        gummies marshmallow topping cake apple pie pudding. Toffee sweet halvah
        cake liquorice chupa chups sugar plum. Tootsie roll marshmallow gummi
        bears apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
        claw caramels cookie dessert cotton candy. Jelly-o sweet sugar plum
        topping topping jujubes powder shortbread lemon drops. Chupa chups
        muffin oat cake chupa chups cookie liquorice oat cake tootsie roll.
        Gingerbread dessert donut pastry muffin powder sugar plum. Chupa chups
        bonbon topping jelly beans pastry. Soufflé chupa chups wafer fruitcake
        lollipop apple pie bonbon tart bonbon.
      </Text>
      <Text>
        Dessert gummies pie biscuit chocolate bar cheesecake. Toffee chocolate
        bar ice cream cake jujubes pudding fruitcake marzipan. Donut sweet oat
        cake dragée candy cupcake biscuit. Carrot cake sesame snaps marzipan
        gummies marshmallow topping cake apple pie pudding. Toffee sweet halvah
        cake liquorice chupa chups sugar plum. Tootsie roll marshmallow gummi
        bears apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
        claw caramels cookie dessert cotton candy. Jelly-o sweet sugar plum
        topping topping jujubes powder shortbread lemon drops. Chupa chups
        muffin oat cake chupa chups cookie liquorice oat cake tootsie roll.
        Gingerbread dessert donut pastry muffin powder sugar plum. Chupa chups
        bonbon topping jelly beans pastry. Soufflé chupa chups wafer fruitcake
        lollipop apple pie bonbon tart bonbon.
      </Text>
      <Text>
        Dessert gummies pie biscuit chocolate bar cheesecake. Toffee chocolate
        bar ice cream cake jujubes pudding fruitcake marzipan. Donut sweet oat
        cake dragée candy cupcake biscuit. Carrot cake sesame snaps marzipan
        gummies marshmallow topping cake apple pie pudding. Toffee sweet halvah
        cake liquorice chupa chups sugar plum. Tootsie roll marshmallow gummi
        bears apple pie cake jujubes pudding. Halvah apple pie tiramisu bear
        claw caramels cookie dessert cotton candy. Jelly-o sweet sugar plum
        topping topping jujubes powder shortbread lemon drops. Chupa chups
        muffin oat cake chupa chups cookie liquorice oat cake tootsie roll.
        Gingerbread dessert donut pastry muffin powder sugar plum. Chupa chups
        bonbon topping jelly beans pastry. Soufflé chupa chups wafer fruitcake
        lollipop apple pie bonbon tart bonbon.
      </Text>
    </Stack>
  );
};
