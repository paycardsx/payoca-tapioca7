import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MenuItem from '@/components/MenuItem';
import DeliveryCheck from '@/components/DeliveryCheck';
import Cart from '@/components/Cart';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import MenuSections from '@/components/MenuSections';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCart } from '@/hooks/useCart';
import { Utensils, Clock, MapPin } from 'lucide-react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const Index = () => {
  const { menuItems } = useMenuItems();
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const { 
    cart, 
    handleAddItem, 
    handleRemoveItem, 
    handleClearCart,
    deliveryAddress,
    paymentMethod,
    cashAmount,
    handleSetDeliveryAddress,
    handleSetPaymentMethod,
    handleSetCashAmount
  } = useCart();

  const handleDeliveryCheck = (price: number, neighborhood: string) => {
    setDeliveryPrice(price);
    setSelectedNeighborhood(neighborhood);
  };

  const cartItems = useMemo<CartItem[]>(() => {
    const allItems = [
      ...menuItems.salgadas,
      ...menuItems.doces,
      ...menuItems.bebidas,
    ];
    
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const item = allItems.find((item) => item.id === id);
        return item
          ? {
              id,
              name: item.name,
              quantity,
              price: item.price,
            }
          : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart, menuItems]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-surface"
    >
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DeliveryCheck 
            onDeliveryPrice={handleDeliveryCheck} 
            cart={cart}
            selectedNeighborhood={selectedNeighborhood}
          />
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MenuSections
            menuItems={menuItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            cart={cart}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Cart
            items={cartItems}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            deliveryPrice={deliveryPrice}
            selectedNeighborhood={selectedNeighborhood}
            deliveryAddress={deliveryAddress}
            paymentMethod={paymentMethod}
            cashAmount={cashAmount}
            onSetDeliveryAddress={handleSetDeliveryAddress}
            onSetPaymentMethod={handleSetPaymentMethod}
            onSetCashAmount={handleSetCashAmount}
          />
        </motion.section>

        <Testimonials />
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;