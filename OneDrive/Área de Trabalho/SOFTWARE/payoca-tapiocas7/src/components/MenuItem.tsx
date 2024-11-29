import React from 'react';
import { Plus, Minus, Star, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAdd: () => void;
  onRemove: () => void;
  quantity: number;
  isPopular?: boolean;
}

const MenuItem = ({ 
  id, 
  name, 
  description, 
  price, 
  imageUrl, 
  onAdd, 
  onRemove, 
  quantity,
  isPopular 
}: MenuItemProps) => {
  const handleAdd = () => {
    onAdd();
    toast.success(`${name} adicionado ao carrinho`);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      onRemove();
      if (quantity === 1) {
        toast.info(`${name} removido do carrinho`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative"
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-yellow-400/90 backdrop-blur-sm text-[#8B4513] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />
            MAIS PEDIDO
          </div>
        </div>
      )}
      
      <div className={cn(
        "relative overflow-hidden",
        imageUrl ? "aspect-[4/3]" : "pt-4 px-4"
      )}>
        {imageUrl ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <motion.img
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </>
        ) : (
          <div className="flex justify-end">
            <div className="bg-yellow-400/90 backdrop-blur-sm text-[#8B4513] text-lg font-bold px-4 py-2 rounded-full">
              R$ {price.toFixed(2)}
            </div>
          </div>
        )}
        
        {/* Preço destacado apenas para itens com imagem */}
        {imageUrl && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-yellow-400/90 backdrop-blur-sm text-[#8B4513] text-lg font-bold px-4 py-2 rounded-full">
              R$ {price.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#8B4513] mb-2 group-hover:text-yellow-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <>
                <Button
                  onClick={handleRemove}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full border-2 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
                >
                  <Minus className="h-4 w-4 text-[#8B4513]" />
                </Button>
                <span className="font-medium text-[#8B4513] min-w-[20px] text-center">
                  {quantity}
                </span>
              </>
            )}
            <Button
              onClick={handleAdd}
              size="icon"
              variant="outline"
              className={cn(
                "h-8 w-8 rounded-full",
                quantity === 0
                  ? "bg-yellow-400 hover:bg-yellow-500 border-none"
                  : "border-2 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
              )}
            >
              <Plus className={cn("h-4 w-4", quantity === 0 ? "text-[#8B4513]" : "text-[#8B4513]")} />
            </Button>
          </div>

          {/* Avaliação */}
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-[#8B4513]">4.8</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;