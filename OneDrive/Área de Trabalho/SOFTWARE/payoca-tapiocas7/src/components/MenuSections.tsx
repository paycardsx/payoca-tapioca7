import React from 'react';
import { MenuItem as MenuItemType } from '@/components/Cart';
import MenuItem from './MenuItem';
import { CartItem } from '@/hooks/useCart';

interface MenuSectionsProps {
  menuItems: {
    salgadas: MenuItemType[];
    doces: MenuItemType[];
    bebidas: MenuItemType[];
  };
  cart: CartItem[];
}

const MenuSections: React.FC<MenuSectionsProps> = ({ menuItems, cart }) => {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tapiocas Salgadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.salgadas.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item}
              quantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tapiocas Doces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.doces.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item}
              quantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bebidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.bebidas.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item}
              quantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MenuSections;