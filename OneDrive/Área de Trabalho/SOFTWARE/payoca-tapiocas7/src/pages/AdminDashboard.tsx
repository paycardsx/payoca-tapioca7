import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { OrderDetails } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuLogOut, LuPackage, LuUser, LuMapPin, LuPhone, LuClock, LuTruck } from 'react-icons/lu';
import { toast } from 'sonner';

const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-800',
    aceito: 'bg-blue-100 text-blue-800',
    preparando: 'bg-purple-100 text-purple-800',
    saiu_entrega: 'bg-orange-100 text-orange-800',
    entregue: 'bg-green-100 text-green-800'
};

const statusLabels = {
    pendente: 'Pendente',
    aceito: 'Aceito',
    preparando: 'Preparando',
    saiu_entrega: 'Saiu para Entrega',
    entregue: 'Entregue'
};

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<OrderDetails[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('adminAuthenticated');
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        const q = query(collection(db, 'orders'), orderBy('timestamps.criado', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData: OrderDetails[] = [];
            querySnapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() } as OrderDetails);
            });
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error('Erro ao carregar pedidos:', error);
            toast.error('Erro ao carregar pedidos');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        navigate('/');
    };

    const updateOrderStatus = async (orderId: string, newStatus: OrderDetails['status']) => {
        if (!orderId) return;
        
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                'timestamps.atualizado': new Date()
            });
            toast.success(`Status atualizado para: ${statusLabels[newStatus]}`);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status do pedido');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-secondary">Carregando...</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-surface"
        >
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-secondary">Painel Administrativo</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                            <LuLogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lista de Pedidos */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-12rem)] overflow-y-auto">
                        <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                            <LuPackage className="w-5 h-5" />
                            Pedidos Recentes
                        </h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                        selectedOrder?.id === order.id 
                                            ? 'border-primary bg-primary/5' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-secondary">#{order.numeroPedido}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <LuUser className="w-4 h-4" />
                                        <span>{order.cliente.nome}</span>
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-secondary">
                                        R$ {order.total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalhes do Pedido */}
                    {selectedOrder ? (
                        <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-12rem)] overflow-y-auto">
                            <h2 className="text-lg font-semibold text-secondary mb-4">
                                Detalhes do Pedido #{selectedOrder.numeroPedido}
                            </h2>
                            
                            {/* Status do Pedido */}
                            <div className="mb-6">
                                <h3 className="font-medium text-secondary mb-3">Atualizar Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(statusLabels).map(([status, label]) => (
                                        <button
                                            key={status}
                                            onClick={() => selectedOrder.id && updateOrderStatus(selectedOrder.id, status as OrderDetails['status'])}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                selectedOrder.status === status
                                                    ? statusColors[status as keyof typeof statusColors]
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Informações do Cliente */}
                            <div className="space-y-4 mb-6">
                                <h3 className="font-medium text-secondary">Informações do Cliente</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <LuUser className="w-4 h-4" />
                                        <span>{selectedOrder.cliente.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <LuPhone className="w-4 h-4" />
                                        <span>{selectedOrder.cliente.telefone}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <LuMapPin className="w-4 h-4 mt-1" />
                                        <div>
                                            <p>{selectedOrder.cliente.endereco.rua}, {selectedOrder.cliente.endereco.numero}</p>
                                            <p>{selectedOrder.cliente.endereco.bairro}</p>
                                            {selectedOrder.cliente.endereco.complemento && (
                                                <p>Complemento: {selectedOrder.cliente.endereco.complemento}</p>
                                            )}
                                            {selectedOrder.cliente.endereco.pontoReferencia && (
                                                <p>Referência: {selectedOrder.cliente.endereco.pontoReferencia}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Itens do Pedido */}
                            <div className="mb-6">
                                <h3 className="font-medium text-secondary mb-3">Itens do Pedido</h3>
                                <div className="space-y-2">
                                    {selectedOrder.itens.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{item.quantidade}x</span>
                                                <span>{item.nome}</span>
                                            </div>
                                            <span className="text-secondary">
                                                R$ {(item.quantidade * item.preco).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumo do Pedido */}
                            <div className="border-t pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>R$ {(selectedOrder.total - selectedOrder.taxaEntrega).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxa de Entrega</span>
                                        <span>R$ {selectedOrder.taxaEntrega.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-secondary text-lg">
                                        <span>Total</span>
                                        <span>R$ {selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <LuClock className="w-4 h-4" />
                                            <span>Forma de Pagamento:</span>
                                        </div>
                                        <span className="font-medium">{selectedOrder.formaPagamento}</span>
                                    </div>
                                    {selectedOrder.troco && (
                                        <div className="flex items-center justify-between text-gray-600 mt-2">
                                            <span>Troco para:</span>
                                            <span className="font-medium">R$ {selectedOrder.troco.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-gray-500">
                            Selecione um pedido para ver os detalhes
                        </div>
                    )}
                </div>
            </main>
        </motion.div>
    );
};

export default AdminDashboard;
