import React from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface CartHeaderProps {
  step: 'cart' | 'address' | 'payment';
  onClose: () => void;
  onBack: () => void;
  showBack: boolean;
}

const CartHeader = ({ step, onClose, onBack, showBack }: CartHeaderProps) => {
  const getTitle = () => {
    switch (step) {
      case 'cart':
        return 'Seu Carrinho';
      case 'address':
        return 'Endereço de Entrega';
      case 'payment':
        return 'Forma de Pagamento';
      default:
        return '';
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">{getTitle()}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CartHeader;