import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./views/home";
import Package from "./views/package";
import Login from "./views/login";
import Registor from "./views/registor";
import Admin from "./views/admin";
import Cookies from "js-cookie";

const App = () => {
  const navigate = useNavigate();
  const checkLogin = async () => {
    var token = Cookies.get("accessToken");
    if (!token) {
      navigate("/login");
    }
  };
  useEffect(() => {
    checkLogin();
  },[checkLogin]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registor" element={<Registor />} />
      <Route path="/package" element={<Package />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default App;
