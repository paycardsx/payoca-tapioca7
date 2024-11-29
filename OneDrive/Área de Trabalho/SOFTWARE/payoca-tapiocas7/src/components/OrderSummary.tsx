import React from 'react';
import { CartItem } from '@/hooks/useCart';
import { DeliveryAddress } from './DeliveryAddressForm';
import { MapPin, CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: string;
  cashAmount: number;
  deliveryPrice: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  deliveryAddress,
  paymentMethod,
  cashAmount,
  deliveryPrice,
  total
}) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const change = cashAmount > total ? cashAmount - total : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Itens do Pedido</h3>
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <span className="text-gray-900">{item.quantity}x </span>
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="text-gray-900">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {deliveryAddress && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Endereço de Entrega
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
            <p className="font-medium">{deliveryAddress.name} {deliveryAddress.surname}</p>
            <p>{deliveryAddress.street}, {deliveryAddress.number}</p>
            <p>{deliveryAddress.neighborhood}</p>
            {deliveryAddress.complement && <p>Complemento: {deliveryAddress.complement}</p>}
            {deliveryAddress.reference && <p>Referência: {deliveryAddress.reference}</p>}
            <p>Telefone: {deliveryAddress.phone}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Pagamento
        </h3>
        <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
          <p>Forma de pagamento: {paymentMethod}</p>
          {paymentMethod.toLowerCase() === 'dinheiro' && cashAmount > 0 && (
            <>
              <p>Troco para: R$ {cashAmount.toFixed(2)}</p>
              {change > 0 && <p>Troco a receber: R$ {change.toFixed(2)}</p>}
            </>
          )}
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Taxa de entrega</span>
          <span>R$ {deliveryPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;