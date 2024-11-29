import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminIcon: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <button 
            onClick={() => navigate('/admin/login')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
            <span className="text-lg">👤</span>
            <span className="text-sm">Área Administrativa</span>
        </button>
    );
};

export default AdminIcon;
