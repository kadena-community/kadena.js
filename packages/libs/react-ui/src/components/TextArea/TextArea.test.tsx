import { Textarea } from '@components/TextArea/TextArea';
import { render } from '@testing-library/react';
import React from 'react';

describe('Textarea', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Textarea id="test-text-area" />);

    const textareaContainer = getByTestId('kda-text-area');
    expect(textareaContainer).toBeInTheDocument();
  });

  test('should render the copy button if the copy button is enabled', () => {
    const { getByTestId } = render(
      <Textarea id="test-text-area" hasCopyButton />,
    );

    const textareaCopyButton = getByTestId('kda-text-area-copy-button');
    expect(textareaCopyButton).toBeInTheDocument();

    const textareaCopyButtonIcon = getByTestId('kda-text-area-copy-button');
    expect(textareaCopyButtonIcon).toBeInTheDocument();
  });

  test('should not render the copy button if the copy button is disabled', () => {
    const { queryByTestId } = render(
      <Textarea id="test-text-area" hasCopyButton={false} />,
    );

    const textareaCopyButton = queryByTestId('kda-text-area-copy-button');
    expect(textareaCopyButton).not.toBeInTheDocument();
  });
});
