import React from 'react';
import { motion } from 'framer-motion';
import { DeliveryAddress } from './DeliveryAddressForm';
import { CreditCard, Banknote, QrCode } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  deliveryPrice: number;
  total: number;
  paymentMethod: string;
  cashAmount: number;
  change: number;
  deliveryAddress: DeliveryAddress | null;
  totalItems: number;
  deliveryMessage: string;
  onPaymentMethodChange: (method: string) => void;
  onCashAmountChange: (amount: number) => void;
  onEditAddress: () => void;
  onWhatsAppClick: () => void;
}

const OrderSummary = ({
  subtotal,
  deliveryPrice,
  total,
  paymentMethod,
  cashAmount,
  change,
  deliveryAddress,
  totalItems,
  deliveryMessage,
  onPaymentMethodChange,
  onCashAmountChange,
  onEditAddress,
  onWhatsAppClick
}: OrderSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4">
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Entrega</span>
          <span>{formatCurrency(deliveryPrice)}</span>
        </div>
        {deliveryPrice > 0 && deliveryMessage && (
          <div className="text-xs text-[#8B4513] mt-0.5 text-center">
            {deliveryMessage}
          </div>
        )}
        <div className="flex justify-between font-bold text-lg text-[#8B4513] pt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {!deliveryAddress && (
        <button
          className="w-full mt-6 bg-[#8B4513] text-yellow-400 py-3 px-6 rounded-lg font-medium hover:bg-[#654321] transition-colors"
          onClick={onEditAddress}
        >
          Adicionar Endereço de Entrega
        </button>
      )}

      {deliveryAddress && (
        <>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-[#8B4513]">Endereço de Entrega</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {deliveryAddress.street}, {deliveryAddress.number}
                  {deliveryAddress.complement && ` - ${deliveryAddress.complement}`}
                  <br />
                  {deliveryAddress.neighborhood}
                </p>
              </div>
              <button
                className="text-[#8B4513] hover:text-[#654321] px-3 py-1 rounded"
                onClick={onEditAddress}
              >
                Editar
              </button>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Forma de Pagamento</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="text-[#8B4513]"
                />
                <span className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" /> PIX
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="text-[#8B4513]"
                />
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Cartão (Débito/Crédito)
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="text-[#8B4513]"
                />
                <span className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" /> Dinheiro
                </span>
              </label>
            </div>

            {paymentMethod === 'cash' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Troco para quanto?
                </label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => onCashAmountChange(Number(e.target.value))}
                  className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Digite o valor"
                />
              </div>
            )}

            {paymentMethod === 'cash' && change > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-50 rounded-lg"
              >
                <p className="font-semibold text-[#8B4513]">
                  Troco: {formatCurrency(change)}
                </p>
              </motion.div>
            )}
          </div>

          <button
            className="w-full mt-6 bg-[#8B4513] text-yellow-400 py-3 px-6 rounded-lg font-medium hover:bg-[#654321] transition-colors"
            onClick={onWhatsAppClick}
          >
            Finalizar Pedido
          </button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;