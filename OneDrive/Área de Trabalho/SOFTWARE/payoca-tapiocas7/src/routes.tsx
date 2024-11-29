import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminPanel/AdminLogin';
import AdminDashboard from './components/AdminPanel/AdminDashboard';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Suas rotas existentes aqui */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
    );
};

export default AppRoutes;
