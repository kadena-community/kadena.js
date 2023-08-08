import { Stack } from '@kadena/react-ui';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack>
      Cookie dragée bear claw ice cream jelly beans fruitcake danish tootsie
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
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Pact',
        menu: 'Test',
        label: 'Pact Test',
        order: 99,
        description: 'Home page',
        layout: 'landing',
        icon: 'PactLanguage',
      },
    },
  };
};

export default Home;
