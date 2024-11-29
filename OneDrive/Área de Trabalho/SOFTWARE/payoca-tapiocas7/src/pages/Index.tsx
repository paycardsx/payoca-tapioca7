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
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const { 
    cart, 
    deliveryAddress, 
    paymentMethod, 
    cashAmount,
    handleSetDeliveryAddress 
  } = useCart();

  // Handler para atualizar o endereço quando o bairro é selecionado
  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    if (deliveryAddress) {
      handleSetDeliveryAddress({
        ...deliveryAddress,
        neighborhood
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gray-50"
    >
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Payoca Tapiocas
          </h1>
          <p className="text-xl text-gray-600">
            Deliciosas tapiocas artesanais feitas com muito amor e carinho
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-700">
              <Utensils className="w-5 h-5 text-primary" />
              <span>Feito na hora</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-primary" />
              <span>Entrega rápida</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Entregamos em toda Maceió</span>
            </div>
          </div>
        </section>

        <MenuSections 
          menuItems={menuItems}
          cart={cart}
        />

        <DeliveryCheck
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodSelect={handleNeighborhoodSelect}
          onDeliveryPriceChange={setDeliveryPrice}
        />

        <Testimonials />
      </main>

      <Cart
        menuItems={menuItems}
        deliveryPrice={deliveryPrice}
        selectedNeighborhood={selectedNeighborhood}
        deliveryAddress={deliveryAddress}
        paymentMethod={paymentMethod}
        cashAmount={cashAmount}
      />

      <Footer />
    </motion.div>
  );
};

export default Index;