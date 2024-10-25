import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import { query, where, collection, doc, addDoc, deleteDoc, onSnapshot, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../data/firebase';

// Inicializa el contexto con los id de joinFmily
const initialState = {
  transactions: [],
  userId: null,
  familyId: null,
}

// Crea el contexto
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    const fetchFamilyId = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'familiasusers', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.familyId) {
              dispatch({ type: 'SET_FAMILY_ID', payload: userData.familyId }); // Actualiza el estado global
            } else {
              console.error('Family ID not found in user document');
            }
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching family ID:', error);
        }
      } else {
        console.error('User not authenticated');
      }
    };

    fetchFamilyId();
  }, []);



  // useEffect para obtener y escuchar los cambios en las transacciones
  useEffect(() => {
    if (state.familyId) {
      const gastosRef = collection(db, `familiasDB/${state.familyId}/gastos`);

      // Escuchar los cambios en Firestore en tiempo real
      const unsubscribe = onSnapshot(gastosRef, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      

        dispatch({
          type: 'SET_TRANSACTIONS',
          payload: transactions
        });
      });

      return () => unsubscribe();
    }
  }, [state.familyId]);

  // Action para eliminar una transacción
  const deleteTransaction = async (id) => {
    const { familyId } = state;
    if (familyId) {
      try {
        // 1. Referencia a la colección de "gastos"
        const gastosRef = collection(db, `familiasDB/${familyId}/gastos`);
  
        // 2. Crear una consulta para encontrar el documento que tiene `id` igual al que deseas eliminar
        const q = query(gastosRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);
  
        // 3. Si se encuentra el documento, eliminarlo
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, `familiasDB/${familyId}/gastos`, docSnapshot.id)); // Elimina usando el ID del documento

          dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id,
          });
        });
  
        if (querySnapshot.empty) {
          console.error('No se encontró ninguna transacción con ese ID.');
        }
  
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    } else {
      console.error('Family ID is not set.');
    }
  };

  // Action para agregar una nueva transacción
  const addTransaction = async (transaction) => {
    const { familyId } = state;
    if (familyId) {
      const gastosRef = collection(db, `familiasDB/${familyId}/gastos`);

      try {
        const docRef = await addDoc(gastosRef, transaction);  // Firestore genera un ID único
        const newTransaction = { id: docRef.id, ...transaction };  // Añade el ID generado por Firestore

        dispatch({
          type: 'ADD_TRANSACTION',
          payload: newTransaction
        });
      } catch (e) {
        console.error('Error adding transaction: ', e);
      }
    } else {
      console.error('Family ID is not set.');
    }
  };

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      userId: state.userId,
      familyId: state.familyId,
      deleteTransaction,
      addTransaction,
      dispatch 
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

