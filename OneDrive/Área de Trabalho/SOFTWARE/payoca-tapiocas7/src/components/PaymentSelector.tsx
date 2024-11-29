import React from 'react';
import { CreditCard, Banknote, QrCode } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface PaymentSelectorProps {
  onPaymentMethodChange: (method: string) => void;
  onCashAmountChange: (amount: number) => void;
}

const PaymentSelector = ({ onPaymentMethodChange, onCashAmountChange }: PaymentSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = React.useState('pix');
  const [cashAmount, setCashAmount] = React.useState('');

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onPaymentMethodChange(value);
  };

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setCashAmount(amount);
    onCashAmountChange(Number(amount) || 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
      <RadioGroup defaultValue="pix" onValueChange={handleMethodChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" /> PIX
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Cartão (Débito/Crédito)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" /> Dinheiro
          </Label>
        </div>
      </RadioGroup>

      {selectedMethod === 'cash' && (
        <div className="space-y-2">
          <Label htmlFor="cashAmount">Troco para quanto?</Label>
          <Input
            id="cashAmount"
            type="number"
            value={cashAmount}
            onChange={handleCashAmountChange}
            placeholder="Digite o valor"
            className="max-w-[200px]"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSelector;