import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Clock, Truck, Info } from 'lucide-react';
import { toast } from 'sonner';
import { NEIGHBORHOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useTapiocaCount } from '@/hooks/useTapiocaCount';

const PROMO_NEIGHBORHOODS = ['Salvador Lyra', 'Antares', 'Santa Lucia', 'Cleto Marques Luz'];

interface DeliveryCheckProps {
  onDeliveryPrice: (price: number, neighborhood: string) => void;
  cart: Record<string, number>;
  selectedNeighborhood: string;
}

const DeliveryCheck = ({ onDeliveryPrice, cart, selectedNeighborhood: propSelectedNeighborhood }: DeliveryCheckProps) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [deliveryInfo, setDeliveryInfo] = useState<typeof NEIGHBORHOODS[number] | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const tapiocaCount = useTapiocaCount(cart);

  useEffect(() => {
    // Define a data final da promoção (sempre às 23:59:59 do dia seguinte)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Reset para o próximo dia
        endDate.setDate(endDate.getDate() + 1);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (propSelectedNeighborhood && propSelectedNeighborhood !== selectedNeighborhood) {
      setSelectedNeighborhood(propSelectedNeighborhood);
      const neighborhood = NEIGHBORHOODS.find(n => n.name === propSelectedNeighborhood);
      setDeliveryInfo(neighborhood || null);
    }
  }, [propSelectedNeighborhood]);

  const handleNeighborhoodSelect = (value: string) => {
    setSelectedNeighborhood(value);
    const neighborhood = NEIGHBORHOODS.find(n => n.name === value);
    setDeliveryInfo(neighborhood || null);

    if (neighborhood) {
      // Se tiver 5 ou mais tapiocas, aplica frete grátis
      const deliveryPrice = tapiocaCount >= 5 ? 0 : neighborhood.price;
      onDeliveryPrice(deliveryPrice, value);
    }
  };

  const remainingTapiocas = Math.max(5 - tapiocaCount, 0);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Promoção Especial */}
      <div className="bg-yellow-400 rounded-lg p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-yellow-900" />
          <h2 className="text-xl font-bold text-yellow-900">PROMOÇÃO ESPECIAL</h2>
        </div>
        <p className="text-yellow-900 mb-2">Compre 5 tapiocas e ganhe frete grátis!</p>
        
        {/* Timer */}
        <div className="flex items-center gap-2 text-yellow-900">
          <Clock className="w-4 h-4" />
          <p className="text-sm">
            Termina em: {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
            {String(timeLeft.hours).padStart(2, '0')}h{' '}
            {String(timeLeft.minutes).padStart(2, '0')}m{' '}
            {String(timeLeft.seconds).padStart(2, '0')}s
          </p>
        </div>

        {/* Contador no canto superior direito */}
        <div className="absolute top-4 right-4 bg-yellow-900 text-yellow-400 px-3 py-1 rounded-full">
          <span className="font-bold">{timeLeft.days}</span>
          <span className="text-sm"> DIAS</span>
        </div>
      </div>

      {/* Consultar Entrega */}
      <div className="bg-brown-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-yellow-400">Consultar Entrega</h2>
        </div>

        <div className="space-y-4">
          <Select value={selectedNeighborhood} onValueChange={handleNeighborhoodSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu bairro" />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOODS.map((neighborhood) => (
                <SelectItem key={neighborhood.name} value={neighborhood.name}>
                  {neighborhood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {deliveryInfo && (
            <div className="space-y-4">
              {/* Frete Grátis Info */}
              <div className={cn(
                "p-4 rounded-lg border",
                tapiocaCount >= 5 
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-yellow-100 border-yellow-500 text-yellow-700"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5" />
                  <h3 className="font-semibold">Frete Grátis</h3>
                </div>
                <p className="text-sm">Em pedidos com 5 ou mais tapiocas para bairros até 3km</p>
                {tapiocaCount < 5 && (
                  <p className="text-sm font-medium mt-2">
                    Faltam apenas {remainingTapiocas} tapioca{remainingTapiocas !== 1 ? 's' : ''} para frete grátis!
                  </p>
                )}
              </div>

              {/* Delivery Info */}
              <div className="bg-brown-700 p-4 rounded-lg">
                <div className="flex items-center justify-between text-yellow-400">
                  <span>Taxa de entrega:</span>
                  <span className="font-bold">
                    {tapiocaCount >= 5 ? 'GRÁTIS' : `R$ ${deliveryInfo.price.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-yellow-400 mt-2">
                  <span>Tempo estimado:</span>
                  <span className="font-bold">{deliveryInfo.time} min</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCheck;