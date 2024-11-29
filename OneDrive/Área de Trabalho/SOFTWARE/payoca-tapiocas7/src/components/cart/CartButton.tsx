import React from 'react';
import { ShoppingCart as ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  itemCount: number;
  total?: number;
  onClick: () => void;
  remainingForFreeDelivery?: number;
}

const CartButton = ({ itemCount = 0, total = 0, onClick, remainingForFreeDelivery = 0 }: CartButtonProps) => {
  const getFreeDeliveryMessage = (remaining: number) => {
    if (remaining <= 0) return '';
    const plural = remaining === 1 ? 'tapioca' : 'tapiocas';
    return `Faltam apenas ${remaining} ${plural} para você garantir frete grátis no seu pedido!`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {remainingForFreeDelivery > 0 && itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              'mb-3 px-4 py-2 rounded-lg shadow-lg',
              'bg-yellow-100 text-[#8B4513] text-sm font-medium',
              'border border-yellow-400',
              'max-w-[250px] sm:max-w-[300px]',
              'animate-pulse'
            )}
          >
            {getFreeDeliveryMessage(remainingForFreeDelivery)}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 px-4 py-3',
          'bg-yellow-400 text-[#8B4513] rounded-full shadow-lg',
          'hover:bg-yellow-500 transition-colors',
          'touch-manipulation',
          'active:bg-yellow-400/80',
          'relative'
        )}
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <ShoppingBag className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="min-w-[20px] h-5 rounded-full bg-[#8B4513] text-yellow-400 text-sm font-medium flex items-center justify-center">
            {itemCount}
          </span>
        )}
        <span className="font-medium hidden md:inline-block ml-1">
          {itemCount === 0 ? 'Carrinho vazio' : `R$ ${total.toFixed(2)}`}
        </span>
        
        {remainingForFreeDelivery > 0 && itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -top-2 -right-2',
              'w-4 h-4 rounded-full',
              'bg-red-500',
              'animate-ping'
            )}
          />
        )}
      </motion.button>
    </div>
  );
};

export default CartButton;