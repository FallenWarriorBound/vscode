import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import MainLayout from './layouts/MainLayout';
import RegisterFlow from './components/RegisterFlow';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<RegisterFlow/>} />
            <Route path="dashboard" element={<UserDashboard/>} />
            <Route path="admin" element={<AdminPanel/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
