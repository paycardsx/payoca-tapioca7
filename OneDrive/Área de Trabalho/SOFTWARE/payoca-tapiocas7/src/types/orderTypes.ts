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

export interface Order {
    id?: string;
    numeroPedido: string;
    cliente: CustomerInfo;
    itens: OrderItem[];
    total: number;
    taxaEntrega: number;
    formaPagamento: string;
    troco?: number;
    status: "pendente" | "aceito" | "preparando" | "saiu_entrega" | "entregue" | "cancelado";
    
    // Informações detalhadas (apenas admin)
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
