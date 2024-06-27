import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You can also log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary>Error details</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded">{this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;