import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartButtonProps {
  onClick: () => void;
  itemCount: number;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick, itemCount }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default CartButton;