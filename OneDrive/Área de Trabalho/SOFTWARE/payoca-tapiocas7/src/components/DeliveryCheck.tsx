import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { NEIGHBORHOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useTapiocaCount } from '@/hooks/useTapiocaCount';
import { useNavigate } from 'react-router-dom';

interface DeliveryCheckProps {
  onDeliveryPrice: (price: number, neighborhood: string) => void;
  cart: Record<string, number>;
  selectedNeighborhood: string;
}

interface Neighborhood {
  name: string;
  distance: number;
  time: number;
  available: boolean;
  freight: number;
}

const DeliveryCheck = ({ onDeliveryPrice, cart, selectedNeighborhood: propSelectedNeighborhood }: DeliveryCheckProps) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(propSelectedNeighborhood || '');
  const [deliveryInfo, setDeliveryInfo] = useState<Neighborhood | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [clicks, setClicks] = useState(0);
  const navigate = useNavigate();

  const tapiocaCount = useTapiocaCount(cart);

  const handleDeliveryBoyClick = () => {
    setClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 2) { 
        setClicks(0);
        navigate('/admin/login');
        return 0;
      }
      return newCount;
    });

    setTimeout(() => {
      setClicks(0);
    }, 1500);
  };

  const calculateDeliveryPrice = (neighborhood: Neighborhood) => {
    return tapiocaCount >= 5 && neighborhood.distance <= 3 ? 0 : neighborhood.freight;
  };

  const updateDeliveryInfo = (neighborhood: Neighborhood, selectedValue: string) => {
    setDeliveryInfo(neighborhood);
    const deliveryPrice = calculateDeliveryPrice(neighborhood);
    onDeliveryPrice(deliveryPrice, selectedValue);
  };

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(21, 0, 0, 0);

      if (now > end) {
        end.setDate(end.getDate() + 1);
      }

      const diff = end.getTime() - now.getTime();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedNeighborhood) {
      const neighborhood = NEIGHBORHOODS.find(n => n.name === selectedNeighborhood);
      if (neighborhood) {
        updateDeliveryInfo(neighborhood, selectedNeighborhood);
      }
    }
  }, [selectedNeighborhood, tapiocaCount]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary">Consulte a entrega para seu bairro</h2>
          <Select
            value={selectedNeighborhood}
            onValueChange={(value) => {
              setSelectedNeighborhood(value);
              const neighborhood = NEIGHBORHOODS.find(n => n.name === value);
              if (!neighborhood?.available) {
                toast.error('Desculpe, ainda não entregamos neste bairro.');
                return;
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu bairro" />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOODS.map((neighborhood) => (
                <SelectItem
                  key={neighborhood.name}
                  value={neighborhood.name}
                  disabled={!neighborhood.available}
                >
                  {neighborhood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {deliveryInfo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Distância: {deliveryInfo.distance} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Tempo estimado: {deliveryInfo.time} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4" />
                <span className={cn(
                  "font-medium",
                  calculateDeliveryPrice(deliveryInfo) === 0 ? "text-green-600" : "text-gray-600"
                )}>
                  Taxa de entrega: {
                    calculateDeliveryPrice(deliveryInfo) === 0
                      ? "GRÁTIS!"
                      : `R$ ${deliveryInfo.freight.toFixed(2)}`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <div 
            className="group cursor-pointer transition-transform hover:scale-105"
            onClick={handleDeliveryBoyClick}
            title="Entregador"
          >
            <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-110 transition-transform">
              🛵
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-secondary text-lg mb-2">
                Promoção Frete Grátis!
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Pedidos com 5 ou mais tapiocas têm frete grátis para bairros até 3km!
              </p>
              <div className="text-sm font-medium text-secondary">
                Válido até às 21:00 - {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCheck;