import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#b71c1c', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>¡Uy! Ocurrió un error inesperado en la página.</h2>
          <p>Por favor, copia el texto de abajo y envíaselo a la IA para que pueda arreglarlo:</p>
          <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ffcdd2', marginTop: '15px', overflowX: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            <br /><br />
            <strong>Component Stack:</strong>
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
