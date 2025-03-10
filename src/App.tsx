import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Explore from "./components/Explore";
import Search from "./components/Search";
import AddBusiness from "./components/AddBusiness";
import Messages from "./components/Messages";
import Market from "./components/Market";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add-business" element={<AddBusiness />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
};

export default App;
