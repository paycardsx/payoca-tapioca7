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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/90 hover:bg-primary transition-all duration-200 text-secondary font-medium shadow-md hover:shadow-lg"
            title="Área Administrativa"
        >
            <LuShieldCheck className="w-5 h-5" />
            <span>Área Administrativa</span>
        </button>
    );
};

export default AdminIcon;
