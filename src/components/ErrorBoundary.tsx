import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Patch Notes crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-1md text-center p-1lg">
          <p className="font-display text-2xl font-semibold text-primary">Something went wrong.</p>
          <p className="text-on-surface-variant">
            Your collection is safe in local storage. Try reloading the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-1lg py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
