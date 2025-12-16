// src/__tests__/index.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home layout', () => {
  it('should render title', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Start Interacting with the Kadena Blockchain',
    );
  });

  it('should render the wallet connection section', () => {
    render(<Home />);

    const heading = screen.queryByText('Wallet', {
      selector: 'h4',
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render blockchain interaction section', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'Write to the blockchain',
      }),
    ).toBeInTheDocument();
  });

  it('should render resources section', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { level: 4, name: 'Resources' }),
    ).toBeInTheDocument();
  });
});

describe('Blockchain interaction', () => {
  it('should contain disabled read and write buttons initially', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: 'Read' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Write' })).toBeDisabled();
  });

  it('should enable read button after connecting wallet', async () => {
    render(<Home />);

    // select the mocked wallet
    fireEvent.change(screen.getByLabelText('Select Wallet'), {
      target: { value: 'Ecko Wallet' },
    });

    // click "Connect Wallet"
    fireEvent.click(screen.getByRole('button', { name: 'Connect Wallet' }));

    // wait for the textarea to show the mocked account
    await screen.findByDisplayValue('k:account');

    expect(screen.getByRole('button', { name: 'Read' })).toBeEnabled();
  });

  it('should enable write button after connecting wallet and entering message', async () => {
    render(<Home />);

    // connect first
    fireEvent.change(screen.getByLabelText('Select Wallet'), {
      target: { value: 'Ecko Wallet' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect Wallet' }));
    await screen.findByDisplayValue('k:account');

    // type into "Write Message"
    fireEvent.change(screen.getByLabelText('Write Message'), {
      target: { value: 'My message' },
    });

    expect(screen.getByRole('button', { name: 'Write' })).toBeEnabled();
  });
});
