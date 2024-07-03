import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TagGroup, TagItem } from '../Tag';

const tags = [
  { id: '1', name: 'News' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Gaming' },
  { id: '4', name: 'Shopping' },
];

describe('Tag', () => {
  const onDelete = vi.fn();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const TestComponent = () => {
    return (
      <TagGroup
        label="Kadena Resources"
        onRemove={() => {
          onDelete();
        }}
        disabledKeys={['2']}
      >
        {tags.map((item) => (
          <TagItem key={item.id}>{item.name}</TagItem>
        ))}
      </TagGroup>
    );
  };

  it('Renders tag group with aria-role and aria-labels', () => {
    const { getByRole } = render(<TestComponent />);

    expect(getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('News').parentElement).toHaveAttribute(
      'aria-label',
      'News',
    );
  });

  it('Renders tag group with disabled tag', () => {
    render(<TestComponent />);

    expect(screen.getByText('Travel').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('Renders tag group with disabled tag', async () => {
    render(<TestComponent />);

    expect(screen.getByText('News').parentElement).toBeInTheDocument();

    await userEvent.tab();
    expect(screen.getByText('News').parentElement).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('Gaming').parentElement).toHaveFocus();

    await userEvent.keyboard('{Backspace}');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
