import React from 'react';
import AdminIcon from './AdminPanel/AdminIcon';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <AdminIcon />
          <div className="text-center">
            <p className="text-sm text-white/90">
              {new Date().getFullYear()} Payoca - Tapiocas com Goma Rendada.
            </p>
            <p className="text-sm text-white/70">
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;