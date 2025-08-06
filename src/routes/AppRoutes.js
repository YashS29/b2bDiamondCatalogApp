// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProductList from '../pages/Products/ProductList';
import CustomerList from '../pages/Customers/CustomerList';
import Logs from '../pages/Logs';
import DashboardLayout from '../layout/DashboardLayout';
import AddProduct from '../pages/Products/AddProduct';
import EditProduct from '../pages/Products/EditProduct';
import DeleteProduct from '../pages/Products/DeleteProduct'; 

const AppRoutes = ({ isLoggedIn, onLogin, onLogout, isLoading, error }) => {

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : (
            <Login onLogin={onLogin} isLoading={isLoading} error={error} />
          )
        }
      />

      {/* Protected Routes with nested structure */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <DashboardLayout onLogout={onLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<AddProduct />} />
<Route path="products/edit/:id" element={<EditProduct />} />
<Route path="products/delete/:id" element={<DeleteProduct />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="logs" element={<Logs />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
    </Routes>
  );
};

export default AppRoutes;