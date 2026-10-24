import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="custom-footer mt-auto">
      <div className="container">
        <div className="row align-items-center gy-2">
          <div className="col-md-6 text-center text-md-start">
            <span className="fw-semibold text-dark">
              Employee Management Dashboard
            </span>{' '}
            &copy; {CURRENT_YEAR} &bull; College Project Demonstration
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="badge bg-light text-secondary border me-2">
              <i className="bi bi-code-slash me-1"></i> React.js + Vite
            </span>
            <span className="badge bg-light text-secondary border">
              <i className="bi bi-cloud-arrow-down me-1"></i> JSONPlaceholder API
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
