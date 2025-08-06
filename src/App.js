import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const handleLogin = (username, password) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setIsLoggedIn(true);
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