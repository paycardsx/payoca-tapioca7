import { useState } from 'react';
import { DeliveryAddress } from '@/components/DeliveryAddressForm';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);

  const handleAddItem = (id: string) => {
    setCart(prev => ({ ...prev, [id]: { id, quantity: 1, price: 0, name: '' } }));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id].quantity > 1) {
        newCart[id].quantity--;
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

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes
      }
    }));
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
    handleSetCashAmount,
    handleUpdateNotes
  };
};