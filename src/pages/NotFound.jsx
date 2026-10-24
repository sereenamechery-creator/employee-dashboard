import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="container py-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
      <div className="display-1 fw-bold text-primary mb-2">404</div>
      <h2 className="fw-bold text-dark mb-2">Page Not Found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: '480px' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-house-door-fill me-1"></i> Back to Home Dashboard
      </Link>
    </main>
  );
};

export default NotFound;
