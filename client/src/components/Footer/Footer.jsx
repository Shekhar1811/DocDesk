// Footer.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="footer mt-auto p-3 fix-osahan-footer">
      <div className="d-flex align-items-center justify-content-between rounded-4 shadow overflow-hidden bottom-nav-main">
        <Link to="/" className={`col footer-bottom-nav ${path === '/' ? 'active' : ''}`}>
          <span className="mdi mdi-home-variant-outline mdi-24px"></span>
          <span>Home</span>
        </Link>
        <Link to="/appointments" className={`col footer-bottom-nav ${path.startsWith('/appointment') ? 'active' : ''}`}>
          <span className="mdi mdi-calendar-clock mdi-24px"></span>
          <span>Appointments</span>
        </Link>
        <Link to="/patients" className={`col footer-bottom-nav ${path.startsWith('/patient') ? 'active' : ''}`}>
          <span className="mdi mdi-account-group-outline mdi-24px"></span>
          <span>Patients</span>
        </Link>
        <Link to="/my-profile" className={`col footer-bottom-nav ${path.startsWith('/my-profile') || path.startsWith('/edit-profile') ? 'active' : ''}`}>
          <span className="mdi mdi-account-circle-outline mdi-24px"></span>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
 
