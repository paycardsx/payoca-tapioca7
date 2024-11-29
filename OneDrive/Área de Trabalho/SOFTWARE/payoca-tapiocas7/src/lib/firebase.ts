import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBg2eMmlDSt3yJ2UIufbzS-JAr1RTFWzlI",
  authDomain: "payoca-tapiocas.firebaseapp.com",
  projectId: "payoca-tapiocas",
  storageBucket: "payoca-tapiocas.appspot.com",
  messagingSenderId: "222109159058",
  appId: "1:222109159058:web:46a771cdea7a1a0e46604b",
  measurementId: "G-BBQWQ12ZGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export interface CustomerInfo {
    nome: string;
    telefone: string;
    endereco: {
        rua: string;
        numero: string;
        complemento?: string;
        bairro: string;
        pontoReferencia?: string;
    };
}

export interface OrderItem {
    nome: string;
    quantidade: number;
    preco: number;
    observacoes?: string;
}

export interface OrderDetails {
    id?: string;
    numeroPedido: string;
    cliente: CustomerInfo;
    itens: OrderItem[];
    total: number;
    taxaEntrega: number;
    formaPagamento: string;
    troco?: number;
    status: "pendente" | "aceito" | "preparando" | "saiu_entrega" | "entregue";
    timestamps: {
        criado: Date;
        aceito?: Date;
        inicioPreparo?: Date;
        prontoEntrega?: Date;
        entregue?: Date;
    };
    notasInternas?: string;
    tempoEstimadoEntrega?: number;
    prioridade: "baixa" | "normal" | "alta";
    problemas?: string[];
}

// Export the Firebase instance if needed
export default app;
