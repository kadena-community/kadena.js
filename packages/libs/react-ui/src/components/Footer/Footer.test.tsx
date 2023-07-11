import { Footer } from '@components/Footer';
import { render } from '@testing-library/react';
import React from 'react';

describe('Footer', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Footer.Root variant="web" color="default">
        <Footer.Panel variant="web">
          <Footer.LinkItem title={'test'}></Footer.LinkItem>
        </Footer.Panel>
      </Footer.Root>,
    );

    const footerContainer = getByTestId('kda-footer');
    expect(footerContainer).toBeInTheDocument();
  });
});
