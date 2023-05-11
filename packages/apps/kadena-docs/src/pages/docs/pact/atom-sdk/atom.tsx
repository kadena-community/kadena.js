import { Text } from '@kadena/react-components';

import { IDocsPageFC } from '@/types/Layout';
import React from 'react';

const Page: IDocsPageFC = () => {
  return (
    <Text>
      Cookie **dragée** bear claw ice cream jelly beans fruitcake danish tootsie
      roll. Donut pastry tiramisu sesame snaps donut tootsie roll candy soufflé.
      Lollipop toffee ice cream jujubes cookie sugar plum croissant. Cookie
      toffee chocolate ice cream apple pie. Brownie gummies cupcake halvah sweet
      roll macaroon soufflé. Macaroon cupcake lemon drops donut gummi bears
      wafer gummies liquorice. Pie oat cake donut biscuit sugar plum chocolate
      lemon drops oat cake. Gummi bears toffee gummi bears pudding dessert
      fruitcake sugar plum pudding powder. Donut marzipan jelly beans candy
      canes toffee. Sweet toffee powder oat cake marzipan pie gummi bears.
      Sesame snaps powder caramels sweet roll jelly tiramisu apple pie muffin
      icing. Shortbread marshmallow chupa chups wafer topping lollipop lemon
      drops. Pudding cheesecake cookie liquorice cake gingerbread tootsie roll.
    </Text>
  );
};

Page.meta = {
  title: 'Pact',
  menu: 'Pact',
  label: 'Pact Test',
  order: 1,
  description: 'How to get started',
  layout: 'code',
};

export default Page;
