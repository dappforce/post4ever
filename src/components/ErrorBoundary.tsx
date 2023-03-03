import React from "react";

export default class ErrorBoundary extends React.Component<
  { children: any },
  { hasError: boolean; error: any; errorInfo: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>ERROR</p>
          <p>{JSON.stringify(this.state.error)}</p>
          <p>ERROR INFO</p>
          <p>{JSON.stringify(this.state.errorInfo)}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
