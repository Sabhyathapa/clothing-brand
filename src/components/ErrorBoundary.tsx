import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 2rem;
  margin: 2rem;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  background-color: #fff5f5;
  color: #e03131;
`;

const ErrorTitle = styled.h2`
  margin-bottom: 1rem;
  color: #c92a2a;
`;

const ErrorMessage = styled.pre`
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <p>We apologize for the inconvenience. Please try refreshing the page.</p>
          {this.state.error && (
            <ErrorMessage>
              {this.state.error.toString()}
            </ErrorMessage>
          )}
          {this.state.errorInfo && (
            <ErrorMessage>
              {this.state.errorInfo.componentStack}
            </ErrorMessage>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 