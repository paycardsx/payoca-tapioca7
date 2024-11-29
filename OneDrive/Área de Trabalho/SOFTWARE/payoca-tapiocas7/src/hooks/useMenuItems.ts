import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface MenuItems {
  salgadas: MenuItem[];
  doces: MenuItem[];
  bebidas: MenuItem[];
}

const INITIAL_MENU_ITEMS: MenuItems = {
  salgadas: [
    { 
      id: '1', 
      name: 'Tradicional', 
      price: 13.20, 
      description: 'Goma rendada de queijo / coco',
      imageUrl: '/tradicional.jpg'
    },
    { 
      id: '2', 
      name: 'Coco & Queijo Coalho', 
      price: 15.20, 
      description: 'Goma rendada de queijo / coco com queijo coalho',
      imageUrl: '/coco-queijo.jpg'
    },
    { 
      id: '3', 
      name: 'Banana & Queijo Coalho', 
      price: 15.20, 
      description: 'Goma rendada de queijo / banana com queijo coalho',
      imageUrl: '/banana-queijo.jpg'
    },
    { 
      id: '4', 
      name: 'Frango & Mussarela', 
      price: 16.20, 
      description: 'Goma rendada de queijo / frango com mussarela',
      imageUrl: '/frango-mussarela.jpg'
    },
  ],
  doces: [
    { 
      id: '5', 
      name: 'Coco & Doce de Leite', 
      price: 15.20, 
      description: 'Goma rendada de queijo / coco e leite condensado',
      imageUrl: '/coco-doce.jpg'
    },
    { 
      id: '6', 
      name: 'Morango & Doce de Leite', 
      price: 16.20, 
      description: 'Goma rendada de queijo / morango e leite condensado',
      imageUrl: '/morango-doce.jpg'
    },
    { 
      id: '7', 
      name: 'Banana & Doce de Leite', 
      price: 15.20, 
      description: 'Goma rendada de queijo / morango e leite condensado',
      imageUrl: '/banana-doce.jpg'
    },
  ],
  bebidas: [
    { 
      id: 'b1', 
      name: 'Suco de Acerola', 
      price: 5.00, 
      description: 'Suco natural de Acerola (300ml)',
      imageUrl: '/suco-acerola.jpg'
    },
    { 
      id: 'b2', 
      name: 'Suco de Goiaba', 
      price: 5.00, 
      description: 'Suco natural de Goiaba (300ml)',
      imageUrl: '/suco-goiaba.jpg'
    },
    { 
      id: 'b3', 
      name: 'Suco de Manga', 
      price: 5.00, 
      description: 'Suco natural de Manga (300ml)',
      imageUrl: '/suco-manga.jpg'
    },
    { 
      id: 'b4', 
      name: 'Café Quente', 
      price: 5.00, 
      description: 'Café quente tradicional (200ml)',
      imageUrl: '/cafe.jpg'
    }
  ]
};

export const useMenuItems = () => {
  const [menuItems] = useState<MenuItems>(INITIAL_MENU_ITEMS);
  return { menuItems };
};