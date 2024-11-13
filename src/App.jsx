import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';

const App = () => {
  return (
    <Router>
      <AdminRoutes />
    </Router>
  );
};

export default App;