import React from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TestFirebase = () => {
  const testFirestore = async () => {
    try {
      // Tenta adicionar um documento
      const docRef = await addDoc(collection(db, 'testes'), {
        mensagem: 'Teste do Firestore',
        timestamp: new Date().toISOString()
      });
      
      alert('Documento adicionado com ID: ' + docRef.id);
      
      // Tenta ler os documentos
      const querySnapshot = await getDocs(collection(db, 'testes'));
      console.log('Documentos na coleção:');
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao testar Firestore: ' + error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Teste do Firebase</h2>
      <button
        onClick={testFirestore}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Testar Conexão com Firestore
      </button>
    </div>
  );
};

export default TestFirebase;
