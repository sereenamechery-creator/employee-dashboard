import React, { useState, useEffect } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch helper used for initial load and manual refresh
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employee records:', err);
      setError(
        err.message || 'Unable to connect to the employee data service. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchInitialData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
        }
        const data = await response.json();
        if (!isCancelled) {
          setEmployees(data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching employee records:', err);
          setError(
            err.message || 'Unable to connect to the employee data service. Please check your network and try again.'
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Client-side search filter by Name, Email, or ID
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      String(emp.id).includes(term)
    );
  });

  return (
    <main className="container py-4 flex-grow-1">
      {/* Page Header / Welcome Banner */}
      <section className="page-header pb-2 border-bottom">
        <div className="row align-items-center gy-3">
          <div className="col-lg-8">
            <h1 className="h2 mb-1">
              <i className="bi bi-speedometer2 text-primary me-2"></i>
              Employee Dashboard
            </h1>
            <p className="text-muted mb-0">
              Welcome back! Here is the latest employee directory fetched in real-time from the external API.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={loadData}
              disabled={loading}
              title="Refresh employee data from API"
            >
              <i className={`bi bi-arrow-clockwise ${loading ? 'spin-animation' : ''}`}></i>
              <span>{loading ? 'Refreshing...' : 'Refresh Records'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric Stat Cards */}
      <section className="row g-3 my-2" aria-label="Dashboard Metrics">
        <div className="col-sm-6 col-lg-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-bold">Total Employees</span>
              <h3 className="fw-bold mb-0 mt-1 text-primary">
                {loading ? (
                  <span className="spinner-border spinner-border-sm text-secondary" role="status"></span>
                ) : (
                  employees.length
                )}
              </h3>
            </div>
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-people"></i>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-bold">API Connection</span>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className={`pulse-dot ${error ? 'bg-danger' : 'bg-success'}`}></span>
                <span className="fw-semibold text-dark">
                  {loading ? 'Syncing...' : error ? 'Disconnected' : 'Online & Live'}
                </span>
              </div>
            </div>
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-hdd-network"></i>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-lg-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-bold">Data Source</span>
              <h6 className="fw-semibold mb-0 mt-1 text-truncate" style={{ maxWidth: '200px' }}>
                JSONPlaceholder API
              </h6>
            </div>
            <div className="stat-icon bg-info-subtle text-info">
              <i className="bi bi-cloud-check"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Table Container Card */}
      <section className="dashboard-card mt-4">
        {/* Card Header with Search Input */}
        <div className="p-3 bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-0 fw-bold text-dark">
              <i className="bi bi-table text-primary me-2"></i>
              Employee Directory
            </h5>
            <small className="text-muted">Displaying verified staff records (ID, Name, Email)</small>
          </div>

          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '360px', width: '100%' }}>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading || Boolean(error)}
                aria-label="Search employee directory"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-light border border-start-0 text-secondary"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* State 1: Loading State */}
        {loading && (
          <div className="text-center py-5" role="status">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading employee records...</span>
            </div>
            <h5 className="fw-bold text-dark mb-1">Loading Employee Directory</h5>
            <p className="text-muted small mb-0">
              Connecting to <code>{API_URL}</code>...
            </p>
          </div>
        )}

        {/* State 2: Error State */}
        {!loading && error && (
          <div className="p-4 m-3 alert alert-danger border-danger-subtle d-flex flex-column flex-sm-row align-items-center gap-3">
            <div className="fs-1 text-danger">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div className="flex-grow-1 text-center text-sm-start">
              <h5 className="alert-heading fw-bold mb-1">Failed to Fetch Employee Data</h5>
              <p className="mb-2 text-danger-emphasis">{error}</p>
              <button
                type="button"
                className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1"
                onClick={loadData}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* State 3: Empty State (No records at all from API or filter returned 0) */}
        {!loading && !error && filteredEmployees.length === 0 && (
          <div className="text-center py-5 px-3">
            <div className="display-4 text-muted mb-2">
              <i className="bi bi-folder-x"></i>
            </div>
            <h5 className="fw-bold text-dark">No Employees Found</h5>
            <p className="text-muted small mb-3">
              {employees.length === 0
                ? 'No employee records are currently available from the API.'
                : `No employee matches the search filter "${searchTerm}".`}
            </p>
            {searchTerm ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search Filter
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={loadData}
              >
                Reload from API
              </button>
            )}
          </div>
        )}

        {/* State 4: Responsive Table with Exactly 3 Fields (ID, Name, Email) */}
        {!loading && !error && filteredEmployees.length > 0 && (
          <div className="table-responsive">
            <table className="table custom-table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '100px' }}>
                    <i className="bi bi-hash me-1"></i> ID
                  </th>
                  <th scope="col">
                    <i className="bi bi-person me-1"></i> Name
                  </th>
                  <th scope="col">
                    <i className="bi bi-envelope me-1"></i> Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const initials = emp.name
                    ? emp.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'E';

                  return (
                    <tr key={emp.id}>
                      {/* 1. ID */}
                      <td>
                        <span className="id-badge">#{String(emp.id).padStart(2, '0')}</span>
                      </td>

                      {/* 2. Name */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-badge" aria-hidden="true">
                            {initials}
                          </div>
                          <div>
                            <span className="fw-semibold text-dark">{emp.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Email */}
                      <td>
                        <a
                          href={`mailto:${emp.email}`}
                          className="text-decoration-none text-primary d-inline-flex align-items-center gap-1"
                        >
                          <i className="bi bi-envelope text-muted"></i>
                          <span>{emp.email}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer Summary */}
        {!loading && !error && employees.length > 0 && (
          <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center text-muted small">
            <span>
              Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
            </span>
            <span>Live Data &bull; JSONPlaceholder</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
