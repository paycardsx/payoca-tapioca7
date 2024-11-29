import React, { useState } from 'react';
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

const Index = () => {
  const { menuItems } = useMenuItems();
  const [deliveryPrice, setDeliveryPrice] = useState(5);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
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

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const allItems = [
      ...menuItems.salgadas,
      ...menuItems.doces,
      ...menuItems.bebidas,
    ];
    const item = allItems.find((item) => item.id === id);
    return item
      ? {
          id,
          name: item.name,
          quantity,
          price: item.price,
        }
      : null;
  }).filter(Boolean);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gray-50"
    >
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
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
          className="mb-12"
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
          className="mb-12"
        >
          <Testimonials />
        </motion.section>

        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Cart
                items={cartItems}
                deliveryPrice={deliveryPrice}
                selectedNeighborhood={selectedNeighborhood}
                onRemoveItem={handleRemoveItem}
                onIncreaseQuantity={handleAddItem}
                onClearCart={handleClearCart}
                onSetDeliveryAddress={handleSetDeliveryAddress}
                menuItems={menuItems}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;