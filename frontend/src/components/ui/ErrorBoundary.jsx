import React from 'react';
import UniversalErrorPage from './UniversalErrorPage.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Basic logging; replace with a proper logger if needed
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <UniversalErrorPage
          code={500}
          title="Something Went Wrong"
          message={this.state.error?.message || 'An unexpected error occurred.'}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
