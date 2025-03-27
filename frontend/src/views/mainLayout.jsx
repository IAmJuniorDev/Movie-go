import React from "react";
import "../styles/layout.css";
import NavbarTop from "../components/navbarTop";
import NavbarBottom from "../components/navbarBottom";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <NavbarTop/>
      <div className="main-content">
        <div className="advertisement-zone">
          <img src="" alt="" />
        </div>
        <main>{children}</main>
      </div>
      <NavbarBottom/>
    </div>
  );
};

export default Layout;
