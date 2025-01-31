import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Settings from './components/Settings/Settings'
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Analytics/Analytics";
import Links from "./components/Links/Links";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="links" element={<Links />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
