import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Item } from 'react-stately';
import { describe, expect, it, vi } from 'vitest';
import { ComboBox } from './ComboBox';

describe('ComboBox', () => {
  it('should not display the options when being closed', () => {
    const { getByText } = render(
      <ComboBox label="Favorite Animal" id="my-combobox" width={250}>
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>,
    );

    expect(getByText('Favorite Animal')).toBeInTheDocument();
    expect(getByText('▼')).toBeInTheDocument();
    expect(screen.queryByText('Cat')).not.toBeInTheDocument();
  });

  it('should display the options when being opened', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { getByRole, getByText } = render(
      <ComboBox label="Favorite Animal" id="my-combobox" width={250}>
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>,
    );

    expect(getByText('Favorite Animal')).toBeInTheDocument();
    expect(getByText('▼')).toBeInTheDocument();
    await user.click(getByRole('button'));
    expect(getByText('Cat')).toBeInTheDocument();
  });

  it('should not be able to enter custom values by default', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const handleChange = vi.fn();

    const { getByRole } = render(
      <ComboBox
        label="Favorite Animal"
        id="my-combobox"
        width={250}
        onInputChange={handleChange}
      >
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>,
    );

    await user.type(getByRole('combobox'), 'My custom value');
    expect(handleChange).toHaveBeenCalledWith('My custom value');
    await user.type(getByRole('combobox'), '{enter}');
    expect((getByRole('combobox') as HTMLInputElement).value).toBe('');
  });

  it('should be able to enter custom values', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const handleChange = vi.fn();
    const { getByRole } = render(
      <ComboBox
        label="Favorite Animal"
        id="my-combobox"
        width={250}
        allowsCustomValue
        onInputChange={handleChange}
      >
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>,
    );

    await user.type(getByRole('combobox'), 'My custom value');
    expect(handleChange).toHaveBeenCalledWith('My custom value');
    await user.type(getByRole('combobox'), '{enter}');
    expect((getByRole('combobox') as HTMLInputElement).value).toBe(
      'My custom value',
    );
  });
});
