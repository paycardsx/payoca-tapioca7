import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface CartHeaderProps {
  step: number;
  onClose: () => void;
  onBack: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({ step, onClose, onBack }) => {
  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Seu Carrinho';
      case 2:
        return 'Endereço de Entrega';
      case 3:
        return 'Forma de Pagamento';
      case 4:
        return 'Resumo do Pedido';
      default:
        return 'Carrinho';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        {step > 1 && (
          <button
            onClick={onBack}
            className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-semibold">{getTitle()}</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartHeader;