import { useModal } from './ModalProvider';

import { Button } from '@components/Button';
import { Text } from '@components/Typography/Text/Text';
import type { FC } from 'react';
import React from 'react';

const ModalContent: FC = () => {
  return (
    <>
      <h4>Getting Started is Simple</h4>
      <Text>
        When tabbing through links in a modal, the focus should stay in the
        modal and not go to the links on the page itself.
        <ul>
          <li>
            <a href="#">link 1</a>
          </li>
          <li>
            <a href="#">link 2</a>
          </li>
          <li>
            <a href="#">link 3</a>
          </li>
        </ul>
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
    </>
  );
};

interface IProps {
  title?: string;
}

export const Content: FC<IProps> = ({ title }) => {
  const { renderModal } = useModal();

  return (
    <>
      <Button
        onClick={() => renderModal(<ModalContent />, title)}
        title="openModal"
      >
        Open modal
      </Button>

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
    </>
  );
};
