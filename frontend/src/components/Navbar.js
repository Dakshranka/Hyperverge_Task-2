import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {token && (
          <>
            <Link className="nav-link" to="/apply">Apply for Loan</Link>
            <Link className="nav-link" to="/kyc">KYC Upload</Link>
          </>
        )}
      </div>

      <div className="navbar-center">
        <Link className="navbar-brand" to="/">LoanAI</Link>
      </div>

      <div className="navbar-right">
        {token ? (
          <button className="nav-link logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
