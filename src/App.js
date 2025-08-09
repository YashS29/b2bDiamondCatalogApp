import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage on initialization to maintain login state after refresh
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const handleLogin = (username, password) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setIsLoggedIn(true);
        // Store login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setError(null);
    // Clear login state from localStorage
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AppRoutes
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
      onLogout={handleLogout}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default App;