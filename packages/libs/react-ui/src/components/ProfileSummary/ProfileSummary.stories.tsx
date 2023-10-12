import type { IProfileSummaryRootProps } from '@components/ProfileSummary';
import { ProfileSummary } from '@components/ProfileSummary';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryComponentType = IProfileSummaryRootProps & {
  links: Record<string, string>;
};

const meta: Meta<StoryComponentType> = {
  title: 'Content/ProfileSummary',
  component: ProfileSummary.Root,
  parameters: {
    docs: {
      description: {
        component:
          'The ProfileSummary component renders a card with a profile picture, name, title, tags, and links. The links are rendered using the `Link` component and can be set with the `links` prop.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryComponentType>;

export const Primary: Story = {
  name: 'ProfileSummary',
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
      <ProfileSummary.Root
        name={name}
        title={title}
        tags={tags}
        imageSrc={imageSrc}
      >
        {Object.entries(links).map(([label, href]) => (
          <ProfileSummary.Link href={href as string} key={href as string}>
            {label}
          </ProfileSummary.Link>
        ))}
      </ProfileSummary.Root>
    );
  },
};
