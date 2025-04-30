import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import TaskPage from "./pages/TaskPage";
import AddProject from "./pages/AddProject";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/projects/:projectId" element={<TaskPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
