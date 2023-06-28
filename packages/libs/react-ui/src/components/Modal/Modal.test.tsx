import { Content } from './StoryComponents';

import { Modal } from '@components/Modal';
import { render } from '@testing-library/react';
import React from 'react';

describe('Modal', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Modal>
        <Content />
      </Modal>,
    );

    const modalContainer = getByTestId('kda-modal');
    expect(modalContainer).toBeInTheDocument();
  });
});
