import React, { useState } from 'react';
import Header from '@/components/Header';
import MenuItem from '@/components/MenuItem';
import DeliveryCheck from '@/components/DeliveryCheck';
import Cart from '@/components/Cart';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import MenuSections from '@/components/MenuSections';
import { motion } from 'framer-motion';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCart } from '@/hooks/useCart';
import { Utensils, Clock, MapPin } from 'lucide-react';

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
    
    // Atualizar o endereço de entrega se já existir
    if (deliveryAddress) {
      handleSetDeliveryAddress({
        ...deliveryAddress,
        neighborhood: neighborhood
      });
    }
  };

  const handleSetAddress = (address: any) => {
    handleSetDeliveryAddress(address);
    // Atualizar o bairro selecionado quando o endereço é atualizado
    setSelectedNeighborhood(address.neighborhood);
  };

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const allItems = [...menuItems.salgadas, ...menuItems.doces, ...(menuItems.bebidas || [])];
    const item = allItems.find(item => item.id === id);
    return {
      id,
      name: item?.name || '',
      quantity,
      price: item?.price || 0,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-[#8B4513] overflow-hidden pt-6 sm:pt-8">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("/pattern.png")',
            backgroundSize: '20px sm:30px',
            transform: 'rotate(30deg)',
          }} />
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 pb-48 sm:pb-56"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-0"
            >
              <img 
                src="/payoca-logo.png" 
                alt="Payoca Logo"
                className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain mx-auto"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-yellow-400 -mt-4 sm:-mt-6 mb-2 sm:mb-4"
            >
              Cardápio Digital
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-yellow-100 max-w-2xl mx-auto px-4"
            >
              Tapiocas com Goma Rendada de Queijo Coalho
            </motion.p>

            {/* Main content starts here */}
          </motion.div>
        </div>

        {/* Ondas decorativas */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-surface w-full block">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <main className="flex-1 bg-surface">
        <div className="container mx-auto px-4 py-0 sm:py-2">
          <MenuSections 
            menuItems={menuItems} 
            onAddItem={handleAddItem} 
            onRemoveItem={handleRemoveItem}
            cart={cart}
          />

          <DeliveryCheck
            onDeliveryPrice={handleDeliveryCheck}
            totalItems={Object.values(cart).reduce((a, b) => a + b, 0)}
            selectedNeighborhood={selectedNeighborhood}
          />

          <Cart
            items={cartItems}
            deliveryPrice={deliveryPrice}
            selectedNeighborhood={selectedNeighborhood}
            onRemoveItem={handleRemoveItem}
            onIncreaseQuantity={handleAddItem}
            onClearCart={handleClearCart}
            onSetDeliveryAddress={handleSetAddress}
            menuItems={{
              salgadas: menuItems.salgadas,
              doces: menuItems.doces,
              bebidas: menuItems.bebidas
            }}
          />

          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;