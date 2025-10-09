// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
import { NetworkContextProvider } from '@/context/networksContext';
import type { NextRouter } from 'next/router';
import { withRouter } from 'next/router';
import type { ReactNode } from 'react';
import React, { Component } from 'react';
import Error from './Error';

// Define the props interface, including the router prop from withRouter
interface IErrorBoundaryProps {
  router: NextRouter;
  children: ReactNode;
}

// Define the state interface
interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(
    error: Error,
  ): Partial<IErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidUpdate(prevProps: IErrorBoundaryProps): void {
    // Reset error state when the route changes
    if (prevProps.router.asPath !== this.props.router.asPath) {
      this.setState({ hasError: false, error: null });
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <NetworkContextProvider>
          <Error error={this.state.error} />;
        </NetworkContextProvider>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
