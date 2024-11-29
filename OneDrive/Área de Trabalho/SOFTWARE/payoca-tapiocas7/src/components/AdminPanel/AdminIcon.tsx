import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminIcon: React.FC = () => {
    const [clicks, setClicks] = useState(0);
    const navigate = useNavigate();
    
    const handleClick = () => {
        setClicks(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) { // Requer 3 cliques para mostrar o login
                setClicks(0);
                navigate('/admin/login');
            }
            return newCount;
        });

        // Reset clicks after 2 seconds if not completed
        setTimeout(() => {
            setClicks(0);
        }, 2000);
    };

    return (
        <div 
            onClick={handleClick}
            className="cursor-default opacity-30 hover:opacity-40 transition-opacity"
            style={{ fontSize: '14px' }}
        >
            👤
        </div>
    );
};

export default AdminIcon;
