import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home layout', () => {
  it('should render title', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(
      'Start Interacting with the Kadena Blockchain',
    );
  });

  it('should render blockchain interaction section', () => {
    render(<Home />);

    const heading = screen.queryByText('Write to the blockchain', {
      selector: 'h4',
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render resources section', () => {
    render(<Home />);

    const heading = screen.queryByText('Resources', { selector: 'h4' });
    expect(heading).toBeInTheDocument();
  });
});

describe('Blockchain interaction', () => {
  it('should contain disabled read and write buttons', () => {
    render(<Home />);

    const readButton = screen.getByRole('button', { name: 'Read' });
    expect(readButton).toBeDisabled();

    const writeButton = screen.getByRole('button', { name: 'Write' });
    expect(writeButton).toBeDisabled();
  });

  it('should enable read button after entering account', () => {
    const account = 'k:account';
    render(<Home />);

    const readButton = screen.getByRole('button', { name: 'Read' });
    expect(readButton).toBeDisabled();

    const accountInput = screen.getByLabelText('My Account');
    fireEvent.change(accountInput, { target: { value: account } });

    expect(readButton).toBeEnabled();
  });

  it('should enable write button after entering account and message', () => {
    const account = 'k:account';
    render(<Home />);

    const writeButton = screen.getByRole('button', { name: 'Write' });
    expect(writeButton).toBeDisabled();

    const accountInput = screen.getByLabelText('My Account');
    fireEvent.change(accountInput, { target: { value: account } });

    const writeMessageInput = screen.getByLabelText('Write Message');
    fireEvent.change(writeMessageInput, { target: { value: 'My message' } });

    expect(writeButton).toBeEnabled();
  });
});
