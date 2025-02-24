import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home";
import About from "./views/about";
import Layout from "./views/mainLayout";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
};

export default App;
