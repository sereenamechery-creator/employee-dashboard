import React, { useState } from 'react';

const initialFormData = {
  name: '',
  designation: '',
  location: '',
  salary: '',
};

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    // 1. Name validation: required, at least 2 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Employee name must be at least 2 characters.';
    }

    // 2. Designation validation: required
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required.';
    } else if (formData.designation.trim().length < 2) {
      newErrors.designation = 'Designation must be at least 2 characters.';
    }

    // 3. Location validation: required
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    // 4. Salary validation: required, positive number (> 0)
    if (!formData.salary) {
      newErrors.salary = 'Salary is required.';
    } else {
      const numericSalary = Number(formData.salary);
      if (isNaN(numericSalary) || numericSalary <= 0) {
        newErrors.salary = 'Salary must be a positive number greater than 0.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate();
    if (isValid) {
      // Store submitted copy for display preview
      setSubmittedData({
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
      });
      setIsSubmitted(true);

      // Scroll to top of card to show confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  // Format currency preview
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="container py-4 flex-grow-1">
      {/* Page Header */}
      <section className="page-header pb-2 border-bottom">
        <h1 className="h2 mb-1">
          <i className="bi bi-person-plus text-primary me-2"></i>
          Employee Registration
        </h1>
        <p className="text-muted mb-0">
          Add a new employee to the directory. Complete all required fields and submit for client-side validation.
        </p>
      </section>

      <div className="row justify-content-center mt-4">
        <div className="col-lg-8 col-xl-7">
          {/* Success Message Banner */}
          {isSubmitted && submittedData && (
            <div className="alert alert-success border-success-subtle shadow-sm p-4 mb-4 rounded-3" role="alert">
              <div className="d-flex align-items-start gap-3">
                <div className="fs-2 text-success">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <h4 className="alert-heading fw-bold mb-1">Employee Registered Successfully!</h4>
                  <p className="mb-3 text-success-emphasis">
                    The new employee record passed client-side validation and has been recorded for this demonstration.
                  </p>

                  {/* Submitted Data Preview Card */}
                  <div className="card bg-white border border-success-subtle p-3 rounded-2 mb-3">
                    <h6 className="text-uppercase text-muted small fw-bold mb-2">Registered Details Preview:</h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                      <li className="d-flex justify-content-between border-bottom pb-1">
                        <span className="text-muted">Employee Name:</span>
                        <strong className="text-dark">{submittedData.name}</strong>
                      </li>
                      <li className="d-flex justify-content-between border-bottom pb-1">
                        <span className="text-muted">Designation:</span>
                        <strong className="text-dark">{submittedData.designation}</strong>
                      </li>
                      <li className="d-flex justify-content-between border-bottom pb-1">
                        <span className="text-muted">Location:</span>
                        <strong className="text-dark">{submittedData.location}</strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span className="text-muted">Salary:</span>
                        <strong className="text-success">{formatSalary(submittedData.salary)} / year</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={handleReset}
                    >
                      <i className="bi bi-plus-lg me-1"></i> Register Another Employee
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form Card */}
          <div className="form-card">
            <div className="form-card-header">
              <h5 className="mb-1 fw-bold text-dark">
                <i className="bi bi-ui-checks text-primary me-2"></i>
                Employee Details Form
              </h5>
              <small className="text-muted">All 4 fields are required with frontend validation</small>
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Field 1: Name */}
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      id="employeeName"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                {/* Field 2: Designation */}
                <div className="mb-3">
                  <label htmlFor="employeeDesignation" className="form-label">
                    Designation / Role <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-briefcase"></i>
                    </span>
                    <input
                      type="text"
                      id="employeeDesignation"
                      name="designation"
                      className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    />
                    {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                  </div>
                </div>

                {/* Field 3: Location */}
                <div className="mb-3">
                  <label htmlFor="employeeLocation" className="form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      id="employeeLocation"
                      name="location"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      placeholder="e.g. New York, USA"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                  </div>
                </div>

                {/* Field 4: Salary */}
                <div className="mb-4">
                  <label htmlFor="employeeSalary" className="form-label">
                    Salary (USD / Year) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-currency-dollar"></i>
                    </span>
                    <input
                      type="number"
                      id="employeeSalary"
                      name="salary"
                      min="1"
                      step="1"
                      className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                      placeholder="e.g. 75000"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                    />
                    {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                  </div>
                  <div className="form-text text-muted">
                    Must be a positive numeric value greater than zero.
                  </div>
                </div>

                {/* Action Buttons: Submit & Reset */}
                <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-check2-circle"></i>
                    <span>Submit</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={handleReset}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Note Callout */}
            <div className="p-3 bg-light border-top text-muted small d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary fs-5"></i>
              <span>
                <strong>College Assignment Note:</strong> This form demonstrates client-side form handling and validation in React.
                No backend POST request or database storage is utilized.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployeeForm;
