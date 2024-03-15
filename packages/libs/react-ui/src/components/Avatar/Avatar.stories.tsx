import { MonoExplore, MonoFiberNew } from '@kadena/react-icons/system';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';
import { withCenteredStory, withContentWidth } from '../../storyDecorators';
import type { IAvatarProps } from './Avatar';
import { Avatar } from './Avatar';

const meta: Meta<IAvatarProps> = {
  title: 'Components/Avatar',
  decorators: [withContentWidth, withCenteredStory],
  component: Avatar,
  parameters: {
    status: {
      type: [''],
    },
    docs: {
      description: {
        component: 'A component used for displaying user icon.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IAvatarProps>;

export const WithName: Story = {
  name: 'Avatar WithName',
  args: {
    name: 'Mafi Rulis',
    status: undefined,
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithImage: Story = {
  name: 'Avatar WithImage',
  args: {
    status: undefined,
    imageUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`,
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithAll: Story = {
  name: 'Avatar WithAll',
  args: {
    name: 'Sam Ferrero',
    icon: <MonoFiberNew />,
    status: undefined,
    imageUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`,
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithStatus: Story = {
  name: 'Avatar WithStatus',
  args: {
    name: 'Sam Ferrero',
    status: 'info',
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithIcon: Story = {
  name: 'Avatar WithIcon',
  args: {
    icon: <MonoExplore />,
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithColor: Story = {
  name: 'Avatar WithColor',
  args: {
    name: 'Sam Ferrero',
    color: 'category8',
    size: 'lg',
    status: 'positive',
  },
  render: ({ name, imageUrl, color, size, status, icon }) => {
    return (
      <Avatar
        name={name}
        color={color}
        imageUrl={imageUrl}
        size={size}
        status={status}
        icon={icon}
      />
    );
  },
};

export const WithNothing: StoryFn<IAvatarProps> = ({
  name,
  imageUrl,
  color,
  size = 'sm',
  status,
  icon,
}) => (
  <Avatar
    name={name}
    color={color}
    imageUrl={imageUrl}
    size={size}
    status={status}
    icon={icon}
  />
);
