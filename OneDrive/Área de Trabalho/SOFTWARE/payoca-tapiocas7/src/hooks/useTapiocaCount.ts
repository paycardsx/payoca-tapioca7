import { useMenuItems } from './useMenuItems';

export const useTapiocaCount = (cart: Record<string, number>) => {
  const { menuItems } = useMenuItems();
  
  const getTapiocaCount = () => {
    const tapiocaItems = [...menuItems.salgadas, ...menuItems.doces];
    const tapiocaIds = new Set(tapiocaItems.map(item => item.id));
    
    return Object.entries(cart).reduce((count, [id, quantity]) => {
      // Exclude beverage IDs (which start with 'b')
      if (tapiocaIds.has(id) && !id.startsWith('b')) {
        return count + quantity;
      }
      return count;
    }, 0);
  };

  return getTapiocaCount();
};
