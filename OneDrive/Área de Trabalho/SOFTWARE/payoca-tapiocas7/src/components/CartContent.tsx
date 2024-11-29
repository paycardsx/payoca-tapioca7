import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { MenuItem, MenuItems } from './Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartContentProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  menuItems: MenuItems;
}

const CartContent: React.FC<CartContentProps> = ({ 
  items, 
  onRemoveItem, 
  onIncreaseQuantity,
  menuItems
}) => {
  const findMenuItem = (id: string): MenuItem | undefined => {
    const allItems = [...menuItems.salgadas, ...menuItems.doces, ...menuItems.bebidas];
    return allItems.find(item => item.id === id);
  };

  // Filtra apenas tapiocas (exclui bebidas)
  const tapiocaItems = items.filter(item => {
    const menuItem = findMenuItem(item.id);
    return menuItem && !menuItems.bebidas.some(bebida => bebida.id === menuItem.id);
  });

  const tapiocaCount = tapiocaItems.reduce((acc, item) => acc + item.quantity, 0);
  const remainingForFreeDelivery = Math.max(5 - tapiocaCount, 0);

  const getFreeDeliveryMessage = () => {
    if (remainingForFreeDelivery === 0) return null;
    const plural = remainingForFreeDelivery === 1 ? 'tapioca' : 'tapiocas';
    return `Faltam apenas ${remainingForFreeDelivery} ${plural} para você garantir frete grátis!`;
  };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Carrinho vazio</h3>
          <p className="mt-1 text-sm text-gray-500">
            Adicione itens ao seu carrinho para começar
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const menuItem = findMenuItem(item.id);
                if (!menuItem) return null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-4 flex justify-between"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {menuItem.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        R$ {menuItem.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4 text-gray-500" />
                      </button>
                      <span className="text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => onIncreaseQuantity(item.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 text-gray-500" />
                      </button>
                      {item.quantity === 1 && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {getFreeDeliveryMessage() && (
            <div className="bg-primary/10 p-4 rounded-lg flex items-center space-x-3">
              <Truck className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm text-primary font-medium">
                {getFreeDeliveryMessage()}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartContent;