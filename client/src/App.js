import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import ImageSearchPage from './pages/ImageSearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/app" element={<ProtectedRoute><ImageSearchPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

// A simple wrapper to ensure user is logged in before showing /app
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default App;
