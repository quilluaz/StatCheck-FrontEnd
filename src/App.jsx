import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
// import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  return (
    <Router>
      <UserRoutes />
      {/* <AdminRoutes /> */}
    </Router>
  );
};

export default App;
