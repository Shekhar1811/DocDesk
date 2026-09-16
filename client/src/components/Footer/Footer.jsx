// Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; 

const Footer = () => {
  return (
    <div className="footer mt-auto p-3 fix-osahan-footer">
      <div className="d-flex align-items-center justify-content-between rounded-4 shadow overflow-hidden bottom-nav-main">
        <Link to="/" className="col footer-bottom-nav active">
          <span className="mdi mdi-home-variant-outline mdi-24px"></span>
          <span>Home</span>
        </Link>
        <Link to="/appointments" className="col footer-bottom-nav">
          <span className="mdi mdi-magnify mdi-24px"></span>
          <span>Appointments</span>
        </Link>
        <Link to="/patients" className="col footer-bottom-nav">
          <span className="mdi mdi-account-outline mdi-24px"></span>
          <span>Patients</span>
        </Link>
        
        <Link to="/my-profile" className="col footer-bottom-nav">
          <span className="mdi mdi-account-outline mdi-24px"></span>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
 
