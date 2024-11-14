import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import Landing from "./userPages/Landing";

const App = () => {
  const [userRole, setUserRole] = useState('user'); // null, 'user', or 'admin'

  const handleLogin = (role) => setUserRole(role);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing onLogin={handleLogin} />} />
        {userRole === "admin" && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}
        {userRole === "user" && <Route path="/*" element={<UserRoutes />} />}
      </Routes>
    </Router>
  );
};

export default App;
