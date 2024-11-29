export interface Promotion {
  id: string;
  type: 'FREE_DELIVERY' | 'DISCOUNTED_DELIVERY';
  title: string;
  description: string;
  conditions: {
    minTapiocas?: number;
    neighborhoods?: string[];
    discountedPrice?: number;
  };
  active: boolean;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: 'free-delivery-5',
    type: 'FREE_DELIVERY',
    title: '🎉 Frete Grátis',
    description: 'Peça 5 ou mais tapiocas e ganhe frete grátis!',
    conditions: {
      minTapiocas: 5
    },
    active: true
  },
  {
    id: 'special-neighborhoods',
    type: 'DISCOUNTED_DELIVERY',
    title: '🏃‍♂️ Frete Promocional',
    description: 'Frete especial de R$ 2,00 para bairros selecionados',
    conditions: {
      neighborhoods: ['Salvador Lyra', 'Antares', 'Santa Lucia', 'Cleto Marques Luz'],
      discountedPrice: 2.00
    },
    active: true
  }
];

// Funções auxiliares para verificar promoções
export const isEligibleForFreeDelivery = (tapiocaCount: number): boolean => {
  const freeDeliveryPromo = PROMOTIONS.find(p => p.id === 'free-delivery-5' && p.active);
  return freeDeliveryPromo ? tapiocaCount >= (freeDeliveryPromo.conditions.minTapiocas || 0) : false;
};

export const getDiscountedDeliveryPrice = (neighborhood: string): number | null => {
  const neighborhoodPromo = PROMOTIONS.find(
    p => p.id === 'special-neighborhoods' && 
    p.active && 
    p.conditions.neighborhoods?.includes(neighborhood)
  );
  return neighborhoodPromo ? neighborhoodPromo.conditions.discountedPrice || null : null;
};

export const getRemainingForFreeDelivery = (tapiocaCount: number): number => {
  const freeDeliveryPromo = PROMOTIONS.find(p => p.id === 'free-delivery-5' && p.active);
  if (!freeDeliveryPromo) return 0;
  return Math.max((freeDeliveryPromo.conditions.minTapiocas || 0) - tapiocaCount, 0);
};

export const getActivePromotions = (): Promotion[] => {
  return PROMOTIONS.filter(p => p.active);
};
