import { Grid } from '@components/Grid';
import { IProfileCardProps, ProfileCard } from '@components/ProfileCard';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IProfileCardProps> = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  argTypes: {
    name: {
      control: {
        type: 'text',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },

    imageSrc: {
      control: {
        type: 'text',
      },
    },
    tags: {
      control: {
        type: 'array',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IProfileCardProps>;

export const Primary: Story = {
  name: 'ProfileCard',
  args: {
    name: 'Tasos Bitsios',
    title: 'Developer Experience Developer (DED)',
    tags: ['Chainweb-stream', 'SSE'],
    imageSrc: 'https://avatars.githubusercontent.com/u/115649719?v=4',
    links: {
      'Personal website': 'https://tasosbitsios.com',
      Twitter: 'https://twitter.com/tasosbitsios',
      'Custom link': 'https://kadena.io',
    },
  },
  render: ({ name, title, tags, imageSrc, links }) => {
    return (
      <Grid.Root columns={12}>
        <Grid.Item columnSpan={6}>
          <ProfileCard
            name={'Tasos Bitsios'}
            title={'Developer Experience Developer (DED)'}
            tags={['Chainweb-stream', 'SSE']}
            imageSrc={'https://avatars.githubusercontent.com/u/115649719?v=4'}
            links={{
              'Personal website': 'https://tasosbitsios.com',
              Twitter: 'https://twitter.com/tasosbitsios',
              'Custom link': 'https://kadena.io',
            }}
          />
        </Grid.Item>
        <Grid.Item columnSpan={6}>
          <ProfileCard
            name={name}
            title={title}
            tags={tags}
            imageSrc={imageSrc}
            links={links}
          />
        </Grid.Item>
      </Grid.Root>
    );
  },
};
