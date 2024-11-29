import { useState, useMemo } from 'react';
import { DeliveryAddress } from '@/components/DeliveryAddressForm';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);

  const handleAddItem = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(i => 
          i.id === id 
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
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

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  return {
    cart: cartItems,
    total,
    deliveryAddress,
    paymentMethod,
    cashAmount,
    handleAddItem,
    handleRemoveItem,
    handleClearCart,
    handleSetDeliveryAddress,
    handleSetPaymentMethod,
    handleSetCashAmount,
  };
};