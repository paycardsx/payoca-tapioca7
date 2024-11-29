import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Payoca - Tapiocas com Goma Rendada. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;