import { useState } from 'react';
import { DeliveryAddress } from '@/components/DeliveryAddressForm';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);

  const handleAddItem = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const handleClearCart = () => {
    setCart({});
    setDeliveryAddress(null);
    setPaymentMethod('');
    setCashAmount(0);
  };

  const handleSetDeliveryAddress = (address: DeliveryAddress) => {
    setDeliveryAddress(address);
  };

  const handleSetPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSetCashAmount = (amount: number) => {
    setCashAmount(amount);
  };

  return {
    cart,
    deliveryAddress,
    paymentMethod,
    cashAmount,
    handleAddItem,
    handleRemoveItem,
    handleClearCart,
    handleSetDeliveryAddress,
    handleSetPaymentMethod,
    handleSetCashAmount
  };
};