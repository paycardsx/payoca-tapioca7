import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FirebaseTest = () => {
  const testFirestore = async () => {
    try {
      // Tenta adicionar um documento de teste
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Teste do Firebase',
        timestamp: new Date()
      });
      
      console.log('Documento adicionado com ID:', docRef.id);
      alert('Conexão com Firebase funcionando! Documento criado com sucesso.');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o Firebase: ' + error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste do Firebase</h2>
      <button
        onClick={testFirestore}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Testar Conexão
      </button>
    </div>
  );
};

export default FirebaseTest;
