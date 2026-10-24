import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        {/* Brand Logo & Title */}
        <Link to="/" className="custom-brand" onClick={closeNav}>
          <div className="brand-icon-box" aria-hidden="true">
            <i className="bi bi-people-fill"></i>
          </div>
          <div>
            <span>Employee Management Dashboard</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white shadow-none"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-3 text-white`}></i>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1 mt-3 mt-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active' : ''}`
                }
                onClick={closeNav}
              >
                <i className="bi bi-house-door-fill"></i>
                <span>Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/employee-form"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active' : ''}`
                }
                onClick={closeNav}
              >
                <i className="bi bi-person-plus-fill"></i>
                <span>Employee Form</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
