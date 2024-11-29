import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Coffee, CupSoda, Coffee as CoffeeIcon, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuSectionsProps {
  menuItems: {
    salgadas: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
    }>;
    doces: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
    }>;
    bebidas: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      options?: Array<{
        id: string;
        name: string;
        default: boolean;
      }>;
    }>;
  };
  onAddItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onSetItemOption?: (itemId: string, optionId: string, value: boolean) => void;
  cart: Record<string, number>;
  itemOptions?: Record<string, Record<string, boolean>>;
}

const MenuSections = ({ 
  menuItems, 
  onAddItem, 
  onRemoveItem, 
  onSetItemOption,
  cart,
  itemOptions = {} 
}: MenuSectionsProps) => {
  const [activeTab, setActiveTab] = useState<'salgadas' | 'doces'>('salgadas');

  const tabs = [
    {
      id: 'salgadas',
      label: 'Tapiocas Salgadas',
      icon: Utensils,
      items: menuItems.salgadas,
    },
    {
      id: 'doces',
      label: 'Tapiocas Doces',
      icon: Coffee,
      items: menuItems.doces,
    }
  ];

  const drinkIcons: Record<string, any> = {
    'Suco de Acerola': Droplets,
    'Suco de Goiaba': Droplets,
    'Suco de Manga': Droplets,
    'Café Quente': CoffeeIcon,
  };

  return (
    <div className="space-y-12">
      {/* Tapiocas Section */}
      <div className="space-y-8">
        {/* Tabs de navegação para tapiocas */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 font-medium",
                  activeTab === tab.id 
                    ? "bg-[#8B4513] text-yellow-400" 
                    : "text-[#8B4513] hover:bg-[#8B4513]/10"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Tapiocas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
          >
            {tabs.find(tab => tab.id === activeTab)?.items.map((item, index) => (
              <MenuItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
                onAdd={() => onAddItem(item.id)}
                onRemove={() => onRemoveItem(item.id)}
                quantity={cart[item.id] || 0}
                isPopular={index < 2}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bebidas Section */}
      <div className="bg-[#8B4513]/5 rounded-3xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#8B4513] mb-2">Bebidas</h2>
          <p className="text-[#8B4513]/70">Complemente seu pedido com nossas bebidas refrescantes</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {menuItems.bebidas.map((drink) => {
            const DrinkIcon = drinkIcons[drink.name] || CupSoda;
            return (
              <motion.div
                key={drink.id}
                className={cn(
                  "bg-white rounded-xl p-4 text-center transition-all",
                  "hover:shadow-lg hover:-translate-y-1",
                  cart[drink.id] > 0 ? "ring-2 ring-[#8B4513]" : ""
                )}
              >
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B4513]/10 flex items-center justify-center">
                    <DrinkIcon className="w-6 h-6 text-[#8B4513]" />
                  </div>
                </div>
                <h3 className="font-medium text-[#8B4513] mb-1">{drink.name}</h3>
                <p className="text-sm text-[#8B4513]/60 mb-3">{drink.description}</p>
                <p className="font-semibold text-[#8B4513] mb-3">R$ {drink.price.toFixed(2)}</p>
                
                {/* Opção de leite para café */}
                {drink.options?.map(option => (
                  <div key={option.id} className="mb-3">
                    <label className="flex items-center justify-center gap-2 text-sm text-[#8B4513]/80 cursor-pointer hover:text-[#8B4513]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#8B4513]/30 text-[#8B4513] focus:ring-[#8B4513]"
                        checked={itemOptions[drink.id]?.[option.id] ?? option.default}
                        onChange={(e) => onSetItemOption?.(drink.id, option.id, e.target.checked)}
                      />
                      {option.name}
                    </label>
                  </div>
                ))}

                <div className="flex justify-center gap-2">
                  {cart[drink.id] > 0 && (
                    <button
                      onClick={() => onRemoveItem(drink.id)}
                      className="px-3 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                    >
                      -
                    </button>
                  )}
                  <button
                    onClick={() => onAddItem(drink.id)}
                    className="px-4 py-1 rounded-full bg-[#8B4513] text-yellow-400 hover:bg-[#8B4513]/90"
                  >
                    {cart[drink.id] > 0 ? `${cart[drink.id]}x` : 'Adicionar'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuSections;