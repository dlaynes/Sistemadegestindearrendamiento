import { Component, type ReactNode, type ErrorInfo } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-destructive rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-destructive-muted p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-destructive">
            Algo salió mal
          </h1>
          <p className="text-muted-foreground">
            Hubo un error inesperado. Por favor intenta recargar la página.
          </p>
          {error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Ver detalles técnicos
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded-lg text-xs text-foreground overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Recargar página
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground py-2.5 rounded-lg hover:bg-muted-foreground/10 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundaryBase fallback={fallback}>
      {children}
    </ErrorBoundaryBase>
  );
}
