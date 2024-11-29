import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CartContent from './CartContent';
import CartHeader from './cart/CartHeader';
import CartButton from './cart/CartButton';
import DeliveryAddressForm, { DeliveryAddress } from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';
import { NEIGHBORHOODS } from '@/lib/constants';
import { ShoppingBag, X, ChevronRight, MapPin, CreditCard, Send } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface MenuItems {
  salgadas: MenuItem[];
  doces: MenuItem[];
  bebidas: MenuItem[];
}

interface CartProps {
  menuItems: MenuItems;
  deliveryPrice: number;
  selectedNeighborhood: string;
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: string;
  cashAmount?: number;
}

const Cart: React.FC<CartProps> = ({ 
  menuItems,
  deliveryPrice,
  selectedNeighborhood,
  deliveryAddress: propDeliveryAddress,
  paymentMethod: propPaymentMethod,
  cashAmount: propCashAmount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { 
    cart,
    total,
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

  const totalWithDelivery = useMemo(() => {
    return total + (deliveryAddress ? deliveryPrice : 0);
  }, [total, deliveryAddress, deliveryPrice]);

  const handleNext = () => {
    if (step === 1 && cart.length === 0) {
      toast.error('Adicione itens ao carrinho para continuar');
      return;
    }
    if (step === 2 && !deliveryAddress) {
      toast.error('Preencha o endereço de entrega para continuar');
      return;
    }
    if (step === 3 && !paymentMethod) {
      toast.error('Selecione um método de pagamento para continuar');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    if (!deliveryAddress || !paymentMethod) {
      toast.error('Preencha todos os dados para finalizar o pedido');
      return;
    }

    // Aqui você pode implementar a lógica para enviar o pedido
    toast.success('Pedido enviado com sucesso!');
    handleClearCart();
    setIsOpen(false);
    setStep(1);
  };

  return (
    <>
      <CartButton 
        onClick={() => setIsOpen(true)} 
        itemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-lg"
            >
              <div className="flex flex-col h-full">
                <CartHeader 
                  step={step} 
                  onClose={() => setIsOpen(false)} 
                  onBack={handleBack}
                />

                <div className="flex-1 overflow-y-auto p-6">
                  {step === 1 && (
                    <CartContent 
                      items={cart}
                      onRemoveItem={handleRemoveItem}
                      onIncreaseQuantity={(id) => {
                        const item = [...menuItems.salgadas, ...menuItems.doces, ...menuItems.bebidas]
                          .find(item => item.id === id);
                        if (item) {
                          handleAddItem(item);
                        }
                      }}
                      menuItems={menuItems}
                    />
                  )}
                  {step === 2 && (
                    <DeliveryAddressForm
                      selectedNeighborhood={selectedNeighborhood}
                      deliveryAddress={deliveryAddress}
                      onSubmit={handleSetDeliveryAddress}
                    />
                  )}
                  {step === 3 && (
                    <PaymentForm
                      paymentMethod={paymentMethod}
                      cashAmount={cashAmount}
                      onSetPaymentMethod={handleSetPaymentMethod}
                      onSetCashAmount={handleSetCashAmount}
                      total={totalWithDelivery}
                    />
                  )}
                  {step === 4 && (
                    <OrderSummary
                      items={cart}
                      deliveryAddress={deliveryAddress}
                      paymentMethod={paymentMethod}
                      cashAmount={cashAmount}
                      deliveryPrice={deliveryPrice}
                      total={totalWithDelivery}
                    />
                  )}
                </div>

                <div className="p-6 border-t">
                  {step < 4 ? (
                    <button
                      onClick={handleNext}
                      className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Continuar
                      <ChevronRight className="inline-block ml-2 w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Finalizar Pedido
                      <Send className="inline-block ml-2 w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;