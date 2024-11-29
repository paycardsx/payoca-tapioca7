import React from 'react';
import { Clock } from 'lucide-react';

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#8B4513] shadow-lg">
      <div className="flex justify-center items-center py-2 sm:py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-100" />
          <span className="text-xs sm:text-sm text-yellow-100">
            Aberto de 16:45 às 21:00
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;