import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Clock, Truck, Info } from 'lucide-react';
import { toast } from 'sonner';
import { NEIGHBORHOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const PROMO_NEIGHBORHOODS = ['Salvador Lyra', 'Antares', 'Santa Lucia', 'Cleto Marques Luz'];

interface DeliveryCheckProps {
  onDeliveryPrice: (price: number, neighborhood: string) => void;
  totalItems: number;
  selectedNeighborhood: string;
}

const DeliveryCheck = ({ onDeliveryPrice, totalItems, selectedNeighborhood: propSelectedNeighborhood }: DeliveryCheckProps) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [deliveryInfo, setDeliveryInfo] = useState<typeof NEIGHBORHOODS[number] | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Define a data final da promoção (2 dias a partir de agora)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
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

  // Sincronizar com o bairro das props
  useEffect(() => {
    if (propSelectedNeighborhood !== selectedNeighborhood) {
      setSelectedNeighborhood(propSelectedNeighborhood);
      const neighborhood = NEIGHBORHOODS.find(n => n.name === propSelectedNeighborhood);
      if (neighborhood) {
        setDeliveryInfo(neighborhood);
      }
    }
  }, [propSelectedNeighborhood]);

  const handleNeighborhoodChange = (value: string) => {
    setSelectedNeighborhood(value);
    const neighborhood = NEIGHBORHOODS.find(n => n.name === value);
    
    if (neighborhood) {
      setDeliveryInfo(neighborhood);
      
      if (!neighborhood.available) {
        toast.info('Ainda não realizamos entregas nesse bairro. Em breve, expandiremos nosso atendimento!');
        onDeliveryPrice(0, value); 
        return;
      }

      const bairrosPromocao = ['Antares', 'Santa Lúcia', 'Canaã', 'Cleto Marques Luz', 'Grand Jardim', 'Aldebaran', 'Serraria', 'Eustáquio'];
      const isBairroPromocao = bairrosPromocao.includes(neighborhood.name);

      let deliveryPrice = neighborhood.freight;
      
      if (totalItems >= 5) {
        if (isBairroPromocao) {
          deliveryPrice = 0;
          toast.success('Parabéns! Você ganhou frete grátis!');
        } else if (neighborhood.distance <= 3) {
          const desconto = 7.50;
          const precoOriginal = deliveryPrice;
          deliveryPrice = Math.max(deliveryPrice - desconto, 0);
          toast.success(`Desconto de R$ ${desconto.toFixed(2)} aplicado no frete! (de R$ ${precoOriginal.toFixed(2)} por R$ ${deliveryPrice.toFixed(2)})`);
        }
      }

      onDeliveryPrice(deliveryPrice, value);
    } else {
      setSelectedNeighborhood('');
      onDeliveryPrice(0, '');
    }
  };

  return (
    <div 
      id="delivery-check"
      className="bg-gradient-to-r from-[#8B4513] to-[#654321] rounded-lg shadow-lg space-y-4 animate-fade-in relative z-10 overflow-hidden"
      tabIndex={-1}
    >
      {/* Banner de Promoção */}
      <div className="bg-yellow-400 p-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-start gap-2 justify-center md:justify-start">
              <span className="text-[#8B4513] text-2xl">🔥</span>
              <div>
                <h3 className="text-[#8B4513] font-extrabold text-xl tracking-tight">
                  PROMOÇÃO
                </h3>
                <h3 className="text-[#8B4513] font-extrabold text-xl tracking-tight -mt-1">
                  ESPECIAL
                </h3>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-[#8B4513] font-semibold text-sm">
                Compre 5 tapiocas e ganhe frete grátis!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="bg-[#8B4513] rounded-lg p-2 text-center min-w-[40px] md:min-w-[45px]">
              <div className="text-yellow-300 font-black text-lg md:text-xl leading-none">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-yellow-100 text-[8px] font-bold mt-1 uppercase">Dias</div>
            </div>
            <div className="text-[#8B4513] font-black text-lg md:text-xl">:</div>
            <div className="bg-[#8B4513] rounded-lg p-2 text-center min-w-[40px] md:min-w-[45px]">
              <div className="text-yellow-300 font-black text-lg md:text-xl leading-none">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-yellow-100 text-[8px] font-bold mt-1 uppercase">Horas</div>
            </div>
            <div className="text-[#8B4513] font-black text-lg md:text-xl">:</div>
            <div className="bg-[#8B4513] rounded-lg p-2 text-center min-w-[40px] md:min-w-[45px]">
              <div className="text-yellow-300 font-black text-lg md:text-xl leading-none">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-yellow-100 text-[8px] font-bold mt-1 uppercase">Min</div>
            </div>
            <div className="text-[#8B4513] font-black text-lg md:text-xl">:</div>
            <div className="bg-[#8B4513] rounded-lg p-2 text-center min-w-[40px] md:min-w-[45px]">
              <div className="text-yellow-300 font-black text-lg md:text-xl leading-none">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-yellow-300/70 text-[10px] uppercase font-medium leading-none mt-1">
                Seg
              </div>
            </div>
          </div>

          <div className="w-24 md:w-32 flex-shrink-0 hidden md:block">
            <img 
              src="/entregador-payoca.png" 
              alt="Entregador"
              className="w-full h-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Consultar Entrega */}
      <div className="p-6 space-y-6">
        <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5" />
          Consultar Entrega
        </h3>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-6">
          {/* Cards de Promoções */}
          <div className="grid grid-cols-1 gap-4">
            {/* Card de Frete Grátis */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 rounded-xl p-4 border border-yellow-400/20 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-400/20 rounded-lg p-2">
                  <Truck className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-yellow-400">Frete Grátis</h4>
                  <p className="text-sm text-yellow-100">
                    Em pedidos com 5 ou mais tapiocas para bairros até 3km
                  </p>
                  {deliveryInfo && deliveryInfo.available && deliveryInfo.distance <= 3 && totalItems < 5 && (
                    <div className="mt-2 bg-yellow-400/10 rounded-lg p-2 border border-yellow-400/20">
                      <p className="text-sm font-medium text-yellow-400">
                        Faltam apenas {5 - totalItems} tapioca{5 - totalItems !== 1 ? 's' : ''} para frete grátis!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Promoção Especial - Só aparece para bairros selecionados */}
            {selectedNeighborhood && PROMO_NEIGHBORHOODS.includes(selectedNeighborhood) && (
              <div
                className="bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-xl p-4 border border-orange-400/20 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-orange-400/20 rounded-lg p-2">
                    <MapPin className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-orange-400">Promoção Especial Ativada!</h4>
                    <p className="text-sm text-yellow-100">
                      Seu bairro tem uma promoção especial!
                    </p>
                    <div className="mt-2 bg-orange-400/20 rounded-lg p-2 border border-orange-400/20">
                      <p className="text-sm font-medium text-orange-400">
                        Taxa de entrega por apenas R$ 2,00 🎉
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seletor de Bairro */}
          <div className="space-y-3">
            <label htmlFor="neighborhood" className="block text-lg font-medium text-yellow-100 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-yellow-400" />
              Selecione seu bairro
            </label>
            <Select value={selectedNeighborhood} onValueChange={handleNeighborhoodChange}>
              <SelectTrigger 
                id="neighborhood" 
                className="w-full bg-white/10 text-yellow-100 border-2 border-yellow-400/30 
                  focus:ring-4 focus:ring-yellow-400/30 focus:border-yellow-400/50 
                  hover:bg-white/20 transition-all duration-200"
              >
                <SelectValue placeholder="Clique para selecionar o bairro" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-yellow-400 shadow-xl rounded-lg">
                <div className="overflow-y-auto py-1 max-h-[300px]">
                  {NEIGHBORHOODS
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((neighborhood) => (
                      <SelectItem 
                        key={neighborhood.name} 
                        value={neighborhood.name}
                        disabled={!neighborhood.available}
                        className={cn(
                          "py-3 px-4 text-base cursor-pointer transition-all duration-200",
                          "hover:bg-yellow-50 focus:bg-yellow-50",
                          "text-[#8B4513] font-medium",
                          !neighborhood.available && "opacity-50"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {neighborhood.name}
                          {!neighborhood.available && (
                            <span className="text-xs bg-yellow-100 text-[#8B4513] px-2 py-1 rounded-full">
                              Em breve
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {deliveryInfo && deliveryInfo.available && (
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-100">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <span>Distância: {deliveryInfo.distance} km</span>
              </div>
              
              <div className="flex items-center gap-2 text-yellow-100">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span>Tempo estimado: {deliveryInfo.time} minutos</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-yellow-400" />
                <div className="flex-1">
                  <span className={`${totalItems >= 5 && deliveryInfo.distance <= 3 ? 'text-green-400 font-medium' : 'text-yellow-100'}`}>
                    {totalItems >= 5 && deliveryInfo.distance <= 3 ? (
                      'Frete grátis para este pedido!'
                    ) : (
                      <>
                        Frete: R$ {deliveryInfo.freight.toFixed(2)}
                        {deliveryInfo.distance <= 3 && (
                          <span className="block text-sm text-yellow-400 mt-1">
                            {totalItems < 5 ? `Adicione ${5 - totalItems} tapioca${5 - totalItems !== 1 ? 's' : ''} para frete grátis!` : ''}
                          </span>
                        )}
                      </>
                    )}
                  </span>
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