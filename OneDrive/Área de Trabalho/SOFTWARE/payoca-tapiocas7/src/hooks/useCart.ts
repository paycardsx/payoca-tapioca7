import { useState } from 'react';
import { DeliveryAddress } from '@/components/DeliveryAddressForm';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, boolean>;
}

export const useCart = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [itemOptions, setItemOptions] = useState<Record<string, Record<string, boolean>>>({});
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
        // Limpar as opções quando o último item é removido
        setItemOptions(prev => {
          const newOptions = { ...prev };
          delete newOptions[id];
          return newOptions;
        });
      }
      return newCart;
    });
  };

  const handleSetItemOption = (itemId: string, optionId: string, value: boolean) => {
    setItemOptions(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [optionId]: value
      }
    }));
  };

  const handleClearCart = () => {
    setCart({});
    setItemOptions({});
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
    itemOptions,
    deliveryAddress,
    paymentMethod,
    cashAmount,
    handleAddItem,
    handleRemoveItem,
    handleSetItemOption,
    handleClearCart,
    handleSetDeliveryAddress,
    handleSetPaymentMethod,
    handleSetCashAmount
  };
};