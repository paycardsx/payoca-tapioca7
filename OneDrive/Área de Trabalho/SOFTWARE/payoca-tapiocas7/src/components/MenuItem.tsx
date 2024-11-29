import React from 'react';
import { Plus, Minus, Star, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { MenuItem as MenuItemType } from './Cart';

interface MenuItemProps {
  item: MenuItemType;
  quantity: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity }) => {
  const { handleAddItem, handleRemoveItem } = useCart();

  const handleAdd = () => {
    handleAddItem(item);
    toast.success(`${item.name} adicionado ao carrinho`);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      handleRemoveItem(item.id);
      if (quantity === 1) {
        toast.info(`${item.name} removido do carrinho`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative"
    >
      {/* Badge de Popular */}
      {item.isPopular && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Flame className="w-3 h-3" />
            <span>Popular</span>
          </div>
        </div>
      )}

      {/* Imagem do Item */}
      <div className="relative">
        {item.imageUrl && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </>
        )}

        {/* Preço */}
        <div className={cn(
          "absolute z-20",
          item.imageUrl ? "bottom-3 right-3" : "top-3 right-3"
        )}>
          <div className="bg-primary text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
            R$ {item.price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Botões de Controle */}
        <div className="flex justify-between items-center pt-2">
          {quantity > 0 ? (
            <div className="flex items-center gap-3 w-full">
              <Button
                onClick={handleRemove}
                variant={quantity === 1 ? "destructive" : "outline"}
                size="icon"
                className="h-9 w-9 shrink-0"
              >
                {quantity === 1 ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </Button>

              <div className="flex-1 text-center">
                <span className="text-lg font-medium text-gray-900">
                  {quantity}
                </span>
              </div>

              <Button
                onClick={handleAdd}
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 text-primary hover:text-primary hover:border-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              variant="default"
              className="w-full h-9 font-medium"
            >
              Adicionar ao Carrinho
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;