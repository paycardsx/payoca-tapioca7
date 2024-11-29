import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShieldCheck, LuUser, LuLock, LuArrowLeft } from "react-icons/lu";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (username === 'adm' && password === '160720') {
            localStorage.setItem('adminAuthenticated', 'true');
            toast.success('Login realizado com sucesso!');
            navigate('/admin/dashboard');
        } else {
            toast.error('Credenciais inválidas');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-surface flex items-center justify-center p-4"
        >
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 md:p-8"
                >
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mb-6"
                    >
                        <LuArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                    </button>

                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <LuShieldCheck className="w-8 h-8 text-secondary" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-secondary mb-6">
                        Área Administrativa
                    </h2>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-secondary">
                                Usuário
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LuUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="Digite seu usuário"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-secondary">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LuLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="Digite sua senha"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-secondary font-medium py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                        >
                            Entrar
                        </button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminLogin;
