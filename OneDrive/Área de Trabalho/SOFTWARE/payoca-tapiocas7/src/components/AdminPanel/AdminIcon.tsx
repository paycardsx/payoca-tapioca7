import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShieldCheck } from "react-icons/lu";

const AdminIcon: React.FC = () => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/admin/login');
    };

    return (
        <button 
            onClick={handleClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            title="Área Administrativa"
        >
            <LuShieldCheck className="w-4 h-4" />
            <span className="text-sm">Área Administrativa</span>
        </button>
    );
};

export default AdminIcon;
