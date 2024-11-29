import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { OrderDetails } from '../lib/firebase';

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<OrderDetails[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

    useEffect(() => {
        // Verifica autenticação
        const isAuthenticated = localStorage.getItem('adminAuthenticated');
        if (!isAuthenticated) {
            window.location.href = '/';
            return;
        }

        // Escuta mudanças nos pedidos
        const q = query(collection(db, 'orders'), orderBy('timestamps.criado', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData: OrderDetails[] = [];
            querySnapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() } as OrderDetails);
            });
            setOrders(ordersData);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        window.location.href = '/';
    };

    const updateOrderStatus = async (orderId: string, newStatus: OrderDetails['status']) => {
        if (!orderId) return;
        
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                'timestamps.atualizado': new Date()
            });
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Painel Administrativo</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lista de Pedidos */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Pedidos Recentes</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">#{order.numeroPedido}</span>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'aceito' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'preparando' ? 'bg-purple-100 text-purple-800' :
                                            order.status === 'saiu_entrega' ? 'bg-orange-100 text-orange-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{order.cliente.nome}</p>
                                    <p className="text-sm text-gray-600">R$ {order.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalhes do Pedido */}
                    {selectedOrder && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-bold mb-4">Detalhes do Pedido #{selectedOrder.numeroPedido}</h2>
                            
                            {/* Status do Pedido */}
                            <div className="mb-4">
                                <h3 className="font-bold mb-2">Status do Pedido</h3>
                                <div className="flex gap-2">
                                    {(['pendente', 'aceito', 'preparando', 'saiu_entrega', 'entregue'] as const).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => selectedOrder.id && updateOrderStatus(selectedOrder.id, status)}
                                            className={`px-3 py-1 rounded text-sm ${
                                                selectedOrder.status === status
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {status.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold">Cliente</h3>
                                    <p>{selectedOrder.cliente.nome}</p>
                                    <p>{selectedOrder.cliente.telefone}</p>
                                    <p>{`${selectedOrder.cliente.endereco.rua}, ${selectedOrder.cliente.endereco.numero}`}</p>
                                    <p>{selectedOrder.cliente.endereco.bairro}</p>
                                    {selectedOrder.cliente.endereco.complemento && (
                                        <p>Complemento: {selectedOrder.cliente.endereco.complemento}</p>
                                    )}
                                    {selectedOrder.cliente.endereco.pontoReferencia && (
                                        <p>Referência: {selectedOrder.cliente.endereco.pontoReferencia}</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold">Itens</h3>
                                    {selectedOrder.itens.map((item, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span>{`${item.quantidade}x ${item.nome}`}</span>
                                            <span>R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>R$ {(selectedOrder.total - selectedOrder.taxaEntrega).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxa de Entrega</span>
                                        <span>R$ {selectedOrder.taxaEntrega.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>R$ {selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold">Pagamento</h3>
                                    <p>{selectedOrder.formaPagamento}</p>
                                    {selectedOrder.troco && (
                                        <p>Troco para: R$ {selectedOrder.troco.toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
