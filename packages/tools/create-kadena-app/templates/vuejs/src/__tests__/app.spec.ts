import { render, screen, fireEvent } from '@testing-library/vue';
import App from '../App.vue';

describe('App page', () => {
  it('should render title', () => {
    render(App);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(
      'Start Interacting with the Kadena Blockchain',
    );
  });

  it('should render the wallet connection section', () => {
    render(App);

    const heading = screen.queryByText('Wallet', {
      selector: 'h4',
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render blockchain interaction section', () => {
    render(App);

    const heading = screen.queryByText('Write to the blockchain', {
      selector: 'h4',
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render resources section', () => {
    render(App);

    const heading = screen.queryByText('Resources', { selector: 'h4' });
    expect(heading).toBeInTheDocument();
  });
});

describe('Blockchain interaction', () => {
  it('should contain disabled read and write buttons', () => {
    render(App);

    const readButton = screen.getByRole('button', { name: 'Read' });
    expect(readButton).toBeDisabled();

    const writeButton = screen.getByRole('button', { name: 'Write' });
    expect(writeButton).toBeDisabled();
  });

  it('should enable read button after entering account', async () => {
    const account = 'k:account';
    render(App);

    const readButton = screen.getByRole('button', { name: 'Read' });
    expect(readButton).toBeDisabled();

    const accountInput = screen.getByLabelText('Connected Account');
    await fireEvent.update(accountInput, account);

    expect(readButton).toBeEnabled();
  });

  it('should enable write button after entering account and message', async () => {
    const account = 'k:account';
    render(App);

    const writeButton = screen.getByRole('button', { name: 'Write' });
    expect(writeButton).toBeDisabled();

    const accountInput = screen.getByLabelText('Connected Account');
    await fireEvent.update(accountInput, account);

    const writeMessageInput = screen.getByLabelText('Write Message');
    await fireEvent.update(writeMessageInput, 'My message');

    expect(writeButton).toBeEnabled();
  });
});
