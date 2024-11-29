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
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-full"
            title="Área Administrativa"
        >
            <LuShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Área Administrativa</span>
        </button>
    );
};

export default AdminIcon;
