export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: 'salgadas' | 'doces' | 'bebidas';
}

export const menu: MenuItem[] = [
  // Tapiocas Salgadas
  {
    id: 'frango',
    name: 'Frango',
    description: 'Frango desfiado, queijo e orégano',
    price: 8.00,
    category: 'salgadas'
  },
  {
    id: 'frango-catupiry',
    name: 'Frango com Catupiry',
    description: 'Frango desfiado, catupiry e orégano',
    price: 10.00,
    category: 'salgadas'
  },
  {
    id: 'carne',
    name: 'Carne',
    description: 'Carne moída, queijo e orégano',
    price: 8.00,
    category: 'salgadas'
  },
  {
    id: 'calabresa',
    name: 'Calabresa',
    description: 'Calabresa, queijo e orégano',
    price: 8.00,
    category: 'salgadas'
  },
  {
    id: 'mista',
    name: 'Mista',
    description: 'Presunto, queijo e orégano',
    price: 7.00,
    category: 'salgadas'
  },
  {
    id: 'queijo',
    name: 'Queijo',
    description: 'Queijo e orégano',
    price: 6.00,
    category: 'salgadas'
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'Presunto, queijo, tomate, orégano e azeitona',
    price: 9.00,
    category: 'salgadas'
  },

  // Tapiocas Doces
  {
    id: 'chocolate',
    name: 'Chocolate',
    description: 'Chocolate ao leite derretido',
    price: 7.00,
    category: 'doces'
  },
  {
    id: 'chocolate-morango',
    name: 'Chocolate com Morango',
    description: 'Chocolate ao leite derretido e morango',
    price: 9.00,
    category: 'doces'
  },
  {
    id: 'chocolate-banana',
    name: 'Chocolate com Banana',
    description: 'Chocolate ao leite derretido e banana',
    price: 9.00,
    category: 'doces'
  },
  {
    id: 'doce-leite',
    name: 'Doce de Leite',
    description: 'Doce de leite cremoso',
    price: 7.00,
    category: 'doces'
  },
  {
    id: 'goiabada',
    name: 'Goiabada',
    description: 'Goiabada cremosa',
    price: 7.00,
    category: 'doces'
  },
  {
    id: 'prestígio',
    name: 'Prestígio',
    description: 'Chocolate ao leite derretido e coco ralado',
    price: 8.00,
    category: 'doces'
  },

  // Bebidas
  {
    id: 'coca-cola-lata',
    name: 'Coca-Cola Lata',
    description: '350ml',
    price: 5.00,
    category: 'bebidas'
  },
  {
    id: 'coca-cola-zero-lata',
    name: 'Coca-Cola Zero Lata',
    description: '350ml',
    price: 5.00,
    category: 'bebidas'
  },
  {
    id: 'guarana-lata',
    name: 'Guaraná Antarctica Lata',
    description: '350ml',
    price: 5.00,
    category: 'bebidas'
  },
  {
    id: 'fanta-laranja-lata',
    name: 'Fanta Laranja Lata',
    description: '350ml',
    price: 5.00,
    category: 'bebidas'
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral',
    description: '500ml',
    price: 3.00,
    category: 'bebidas'
  },
  {
    id: 'agua-gas',
    name: 'Água com Gás',
    description: '500ml',
    price: 4.00,
    category: 'bebidas'
  }
];
