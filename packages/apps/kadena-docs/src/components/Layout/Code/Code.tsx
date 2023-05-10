import { Article, Aside, CodeBackground, Content } from '../components';

import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';

export const Code: FC<ILayout> = ({ children, isAsideOpen }) => {
  return (
    <>
      <Content id="maincontent">
        <Article>{children}</Article>
      </Content>
      <CodeBackground isOpen={isAsideOpen} />

      <Aside layout="code" isOpen={isAsideOpen}>
        <p>
          Tenetur quod quidem in voluptatem corporis dolorum dicta sit pariatur
          porro quaerat autem ipsam odit quam beatae tempora quibusdam illum!
          Modi velit odio nam nulla unde amet odit pariatur at!
        </p>
        <p>
          Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto
          nihil explicabo perferendis quos provident delectus ducimus
          necessitatibus reiciendis optio tempora unde earum doloremque commodi
          laudantium ad nulla vel odio?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
          minus molestiae vel beatae natus eveniet ratione temporibus aperiam
          harum alias officiis assumenda officia quibusdam deleniti eos
          cupiditate dolore doloribus!
        </p>
        <p>
          Ad dolore dignissimos asperiores dicta facere optio quod commodi nam
          tempore recusandae. Rerum sed nulla eum vero expedita ex delectus
          voluptates rem at neque quos facere sequi unde optio aliquam!
        </p>
        <p>
          Tenetur quod quidem in voluptatem corporis dolorum dicta sit pariatur
          porro quaerat autem ipsam odit quam beatae tempora quibusdam illum!
          Modi velit odio nam nulla unde amet odit pariatur at!
        </p>
        <p>
          Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto
          nihil explicabo perferendis quos provident delectus ducimus
          necessitatibus reiciendis optio tempora unde earum doloremque commodi
          laudantium ad nulla vel odio?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
          minus molestiae vel beatae natus eveniet ratione temporibus aperiam
          harum alias officiis assumenda officia quibusdam deleniti eos
          cupiditate dolore doloribus!
        </p>
        <p>
          Ad dolore dignissimos asperiores dicta facere optio quod commodi nam
          tempore recusandae. Rerum sed nulla eum vero expedita ex delectus
          voluptates rem at neque quos facere sequi unde optio aliquam!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
          minus molestiae vel beatae natus eveniet ratione temporibus aperiam
          harum alias officiis assumenda officia quibusdam deleniti eos
          cupiditate dolore doloribus!
        </p>
        <p>
          Ad dolore dignissimos asperiores dicta facere optio quod commodi nam
          tempore recusandae. Rerum sed nulla eum vero expedita ex delectus
          voluptates rem at neque quos facere sequi unde optio aliquam!
        </p>
        <p>
          Tenetur quod quidem in voluptatem corporis dolorum dicta sit pariatur
          porro quaerat autem ipsam odit quam beatae tempora quibusdam illum!
          Modi velit odio nam nulla unde amet odit pariatur at!
        </p>
        <p>
          Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto
          nihil explicabo perferendis quos provident delectus ducimus
          necessitatibus reiciendis optio tempora unde earum doloremque commodi
          laudantium ad nulla vel odio?
        </p>
        <p>
          Tenetur quod quidem in voluptatem corporis dolorum dicta sit pariatur
          porro quaerat autem ipsam odit quam beatae tempora quibusdam illum!
          Modi velit odio nam nulla unde amet odit pariatur at!
        </p>
        <p>
          Consequatur rerum amet fuga expedita sunt et tempora saepe? Iusto
          nihil explicabo perferendis quos provident delectus ducimus
          necessitatibus reiciendis optio tempora unde earum doloremque commodi
          laudantium ad nulla vel odio?
        </p>
      </Aside>
    </>
  );
};

Code.displayName = 'CodeSide';
