import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Une erreur est survenue.</h1>
          <Link to="/">Retourner à l'accueil</Link>
        </>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary;