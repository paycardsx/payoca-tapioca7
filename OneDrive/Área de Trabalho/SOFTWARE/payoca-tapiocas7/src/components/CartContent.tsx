import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItem } from './Cart';
import { 
  isEligibleForFreeDelivery, 
  getDiscountedDeliveryPrice,
  getRemainingForFreeDelivery,
  getActivePromotions,
  Promotion 
} from '@/lib/promotions';

interface CartContentProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  deliveryPrice: number;
  selectedNeighborhood: string;
  menuItems: {
    salgadas: any[];
    doces: any[];
    bebidas: any[];
  };
}

const CartContent = ({ 
  items, 
  onRemoveItem, 
  onIncreaseQuantity,
  deliveryPrice,
  selectedNeighborhood,
  menuItems
}: CartContentProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Filtra apenas tapiocas (exclui bebidas)
  const tapiocaItems = items.filter(item => {
    const allTapiocas = [...menuItems.salgadas, ...menuItems.doces];
    return allTapiocas.some(tapioca => tapioca.id === item.id);
  });

  const tapiocaCount = tapiocaItems.reduce((acc, item) => acc + item.quantity, 0);
  const remainingForFreeDelivery = getRemainingForFreeDelivery(tapiocaCount);
  const activePromotions = getActivePromotions();
  
  // Calcula o frete final usando as novas funções de promoção
  const finalDeliveryPrice = isEligibleForFreeDelivery(tapiocaCount)
    ? 0
    : getDiscountedDeliveryPrice(selectedNeighborhood) || deliveryPrice;
  
  const total = subtotal + finalDeliveryPrice;

  // Componente para mostrar promoções ativas
  const ActivePromotions = () => (
    <AnimatePresence>
      {activePromotions.map((promo: Promotion) => (
        <motion.div
          key={promo.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4",
            "flex items-center gap-3 text-[#8B4513]"
          )}
        >
          <Truck className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{promo.title}</p>
            <p className="text-sm">{promo.description}</p>
            {promo.type === 'FREE_DELIVERY' && remainingForFreeDelivery > 0 && (
              <p className="text-sm font-medium mt-1">
                Faltam apenas {remainingForFreeDelivery} {remainingForFreeDelivery === 1 ? 'tapioca' : 'tapiocas'}!
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );

  return (
    <div className="p-4 space-y-6">
      <AnimatePresence>
        {items.length > 0 ? (
          <div className="space-y-4">
            {/* Promoções Ativas */}
            <ActivePromotions />

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
                <div className="flex items-center gap-2">
                  <span>Taxa de entrega</span>
                  {isEligibleForFreeDelivery(tapiocaCount) && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Frete Grátis
                    </span>
                  )}
                  {!isEligibleForFreeDelivery(tapiocaCount) && getDiscountedDeliveryPrice(selectedNeighborhood) && (
                    <span className="text-xs bg-yellow-100 text-[#8B4513] px-2 py-0.5 rounded-full">
                      Frete Promocional
                    </span>
                  )}
                </div>
                <span className="font-medium">R$ {finalDeliveryPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-[#8B4513] pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Seu carrinho está vazio</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartContent;