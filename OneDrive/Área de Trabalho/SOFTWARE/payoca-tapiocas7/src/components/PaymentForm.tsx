import React, { useState } from 'react';
import { CreditCard, Wallet, Banknote, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentFormProps {
  total: number;
  onSubmit: (method: string) => void;
  onSetCashAmount: (amount: number) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'credit',
    name: 'Cartão de Crédito',
    icon: CreditCard
  },
  {
    id: 'debit',
    name: 'Cartão de Débito',
    icon: Wallet
  },
  {
    id: 'cash',
    name: 'Dinheiro',
    icon: Banknote
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: QrCode
  }
];

const PaymentForm = ({ total, onSubmit, onSetCashAmount }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;

    setIsSubmitting(true);
    try {
      if (selectedMethod === 'cash' && cashAmount) {
        onSetCashAmount(parseFloat(cashAmount));
      }
      await onSubmit(selectedMethod);
    } finally {
      setIsSubmitting(false);
    }
  };

  const change = selectedMethod === 'cash' && cashAmount 
    ? parseFloat(cashAmount) - total 
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Total do pedido */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total do pedido</p>
        <p className="text-2xl font-semibold text-gray-900">
          R$ {total.toFixed(2)}
        </p>
      </div>

      {/* Métodos de pagamento */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          Selecione a forma de pagamento
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                "hover:bg-gray-50",
                selectedMethod === method.id 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200"
              )}
            >
              <method.icon className={cn(
                "h-6 w-6",
                selectedMethod === method.id ? "text-primary" : "text-gray-400"
              )} />
              <span className="text-sm font-medium text-gray-900">
                {method.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Campo de troco para pagamento em dinheiro */}
      {selectedMethod === 'cash' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Troco para quanto?
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder="0,00"
              step="0.01"
              min={total}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {change > 0 && (
            <p className="text-sm text-gray-600">
              Troco: R$ {change.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedMethod || isSubmitting}
        className={cn(
          "w-full rounded-lg bg-primary px-4 py-3 text-white font-medium",
          "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "transition-colors relative",
          (!selectedMethod || isSubmitting) && "opacity-75 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <span className="opacity-0">Finalizar Pedido</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        ) : (
          'Finalizar Pedido'
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
