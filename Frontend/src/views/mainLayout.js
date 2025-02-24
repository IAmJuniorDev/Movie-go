import React from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="layout-nav">
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
