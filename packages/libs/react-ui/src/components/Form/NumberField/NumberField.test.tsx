import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { NumberField } from './NumberField';

import userEvent from '@testing-library/user-event';
import { Form } from '../Form';

describe('NumberField', () => {
  const label = 'What is 2+2?';
  it('should render without errors', () => {
    render(<NumberField label={label} />);
    const component = screen.getByRole('textbox', { name: label });
    expect(component).toBeInTheDocument();
  });

  it('should update value when use start typing ', async () => {
    render(<NumberField label={label} />);
    const textbox = screen.getByLabelText(label);
    await userEvent.type(textbox, '4');
    expect(textbox).toHaveValue('4');
  });

  it('should render the provided description', () => {
    render(<NumberField label={label} description="This is a description" />);
    const description = screen.getByText('This is a description');
    expect(description).toBeInTheDocument();
  });

  it('should render the provided error message', () => {
    render(
      <NumberField
        label={label}
        description="This is a description"
        isInvalid
        errorMessage="This is an error message"
      />,
    );
    const errorMessage = screen.getByText('This is an error message');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render the provided start addon', () => {
    render(<NumberField label={label} startVisual={<span>icon</span>} />);
    const icon = screen.getByText('icon');
    expect(icon).toBeInTheDocument();
  });

  it('should disable the input when isDisabled prop is true', () => {
    render(<NumberField label={label} disabled />);
    const component = screen.getByRole('textbox', { name: label });
    expect(component).toBeDisabled();
  });

  it('should render the provided value', () => {
    render(<NumberField label={label} value={9} />);
    const component = screen.getByRole('textbox', { name: label });
    expect(component).toHaveValue('9');
  });

  it('should render the provided label', () => {
    render(<NumberField label={label} />);
    const component = screen.getByText(label);
    expect(component).toBeInTheDocument();
  });

  it('should show native validation error rendered inside a Form and validationBehavior="native"', async () => {
    render(
      <Form>
        <NumberField label={label} isRequired validationBehavior="native" />
        <button type="submit">Submit</button>
      </Form>,
    );
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    const component = screen.getByRole('textbox', { name: label });
    expect(component).toBeInvalid();
  });
});
