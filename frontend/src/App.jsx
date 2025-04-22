import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "views/home";
import Package from "views/package";
import Login from "views/login";
import Registor from "views/registor";
import Admin from "views/admin";
import ProtectedRoute from "libs/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* non control access */}
      <Route path="/login" element={<Login />} />
      <Route path="/registor" element={<Registor />} />
      <Route path="/package" element={<Package />} />
      {/* control access */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default App;
