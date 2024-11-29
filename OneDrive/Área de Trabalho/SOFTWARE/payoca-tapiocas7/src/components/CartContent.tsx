import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from './Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartContentProps {
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onIncreaseQuantity: (itemId: string) => void;
  deliveryPrice: number;
  selectedNeighborhood: string;
  menuItems: {
    salgadas: any[];
    doces: any[];
    bebidas: any[];
  };
}

const PROMO_NEIGHBORHOODS = ['Salvador Lyra', 'Antares', 'Santa Lucia', 'Cleto Marques Luz'];
const PROMO_DELIVERY_PRICE = 2.00;

const CartContent = ({ 
  items, 
  onRemoveItem, 
  onIncreaseQuantity,
  deliveryPrice,
  selectedNeighborhood,
  menuItems
}: CartContentProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (PROMO_NEIGHBORHOODS.includes(selectedNeighborhood) && items.some(item => !menuItems.bebidas.some(bebida => bebida.id === item.id)) ? PROMO_DELIVERY_PRICE : deliveryPrice);

  // Filtra apenas tapiocas (exclui bebidas)
  const tapiocaItems = items.filter(item => {
    const allTapiocas = [...menuItems.salgadas, ...menuItems.doces];
    return allTapiocas.some(tapioca => tapioca.id === item.id);
  });

  const tapiocaCount = tapiocaItems.reduce((acc, item) => acc + item.quantity, 0);
  const remainingForFreeDelivery = Math.max(5 - tapiocaCount, 0);

  const getFreeDeliveryMessage = () => {
    if (remainingForFreeDelivery === 0) return null;
    const plural = remainingForFreeDelivery === 1 ? 'tapioca' : 'tapiocas';
    return `Faltam apenas ${remainingForFreeDelivery} ${plural} para você garantir frete grátis!`;
  };

  return (
    <div className="p-4 space-y-6">
      <AnimatePresence>
        {items.length > 0 ? (
          <div className="space-y-4">
            {/* Mensagem de Frete Grátis */}
            {remainingForFreeDelivery > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "bg-yellow-100 border border-yellow-400 rounded-lg p-4",
                  "flex items-center gap-3 text-[#8B4513]"
                )}
              >
                <Truck className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{getFreeDeliveryMessage()}</p>
              </motion.div>
            )}

            {/* Lista de Itens */}
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex flex-col md:flex-row items-start md:items-center gap-3 p-3 md:p-4 rounded-xl border border-gray-100",
                  "bg-white shadow-sm hover:shadow-md transition-all duration-200"
                )}
              >
                <div className="flex-1 w-full md:w-auto space-y-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm font-medium text-primary">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                      "hover:bg-gray-100 active:scale-95",
                      item.quantity === 1 && "text-red-500 hover:bg-red-50"
                    )}
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </button>
                  
                  <span className="w-8 text-center font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => onIncreaseQuantity(item.id)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg",
                      "hover:bg-primary/10 active:scale-95 transition-all",
                      "text-primary"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col md:flex-row justify-between text-gray-600 gap-2 md:gap-0">
                <span className="flex items-center gap-2 text-sm md:text-base">
                  Taxa de entrega
                  {tapiocaCount >= 5 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Frete Grátis
                    </span>
                  )}
                  {PROMO_NEIGHBORHOODS.includes(selectedNeighborhood) && tapiocaCount < 5 && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Desconto Especial
                    </span>
                  )}
                </span>
                <span className="font-medium text-sm md:text-base">
                  {tapiocaCount >= 5 ? (
                    <span className="line-through text-gray-400">
                      R$ {deliveryPrice.toFixed(2)}
                    </span>
                  ) : PROMO_NEIGHBORHOODS.includes(selectedNeighborhood) ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        R$ {deliveryPrice.toFixed(2)}
                      </span>
                      R$ {PROMO_DELIVERY_PRICE.toFixed(2)}
                    </>
                  ) : (
                    `R$ ${deliveryPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-500"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-gray-900">Seu carrinho está vazio</p>
            <p className="text-sm text-gray-500">Adicione alguns itens para continuar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartContent;