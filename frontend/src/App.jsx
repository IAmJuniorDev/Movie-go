import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home";
import Package from "./views/package";
import Login from "./views/login";
import Registor from "./views/registor";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registor" element={<Registor />} />
      <Route path="/package" element={<Package />} />
    </Routes>
  );
};

export default App;
