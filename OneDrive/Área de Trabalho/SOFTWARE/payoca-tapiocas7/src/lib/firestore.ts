import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Interfaces
export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// Collections
const CUSTOMERS = 'customers';
const ORDERS = 'orders';

// Customer Functions
export const addCustomer = async (customer: Omit<Customer, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, CUSTOMERS), customer);
    return { id: docRef.id, ...customer };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const getCustomerByEmail = async (email: string) => {
  try {
    const q = query(collection(db, CUSTOMERS), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

// Order Functions
export const createOrder = async (order: Omit<Order, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS), {
      ...order,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const orderRef = doc(db, ORDERS, orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(collection(db, ORDERS), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
};
