import React, { useState, useEffect } from 'react';
import { auth, db } from '../../data/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const ListaCompras = () => {
  const [familyId, setFamilyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCompraId, setCurrentCompraId] = useState(null);
  const [isCreatingCompra, setIsCreatingCompra] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [brand, setBrand] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [showingHistory, setShowingHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const fetchFamilyIdAndActiveList = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'familiasusers', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.familyId) {
              setFamilyId(userData.familyId);
              await checkForActiveList(userData.familyId);
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
      setLoading(false);
    };
    fetchFamilyIdAndActiveList();
  }, []);

  const checkForActiveList = async (familyId) => {
    try {
      const listasComprasRef = collection(db, `familiasDB/${familyId}/listasCompras`);
      const activeListQuery = query(listasComprasRef, where("active", "==", true), limit(1));
      const querySnapshot = await getDocs(activeListQuery);
      
      if (!querySnapshot.empty) {
        const activeList = querySnapshot.docs[0];
        setCurrentCompraId(activeList.id);
        setShoppingList(activeList.data().items || []);
        setIsCreatingCompra(true);
      }
    } catch (error) {
      console.error('Error checking for active list:', error);
    }
  };

  const handleCrearCompra = async () => {
    if (familyId) {
      try {
        const listasComprasRef = collection(db, `familiasDB/${familyId}/listasCompras`);
        const newCompraDoc = await addDoc(listasComprasRef, {
          createdAt: new Date(),
          items: [],
          active: true
        });
        setCurrentCompraId(newCompraDoc.id);
        setIsCreatingCompra(true);
        setShoppingList([]);
      } catch (error) {
        console.error('Error creating new compra:', error);
      }
    }
  };

  const handleAddItem = async () => {
    if (itemName.trim() && currentCompraId) {
      const newItem = { name: itemName, quantity, weight, brand };
      const updatedList = [...shoppingList, newItem];
      setShoppingList(updatedList);
      
      try {
        const compraDocRef = doc(db, `familiasDB/${familyId}/listasCompras`, currentCompraId);
        await updateDoc(compraDocRef, {
          items: updatedList
        });
      } catch (error) {
        console.error('Error adding item to Firebase:', error);
      }

      setItemName('');
      setQuantity('');
      setWeight('');
      setBrand('');
    }
  };

  const handleCerrarCompra = async () => {
    if (currentCompraId) {
      try {
        const compraDocRef = doc(db, `familiasDB/${familyId}/listasCompras`, currentCompraId);
        await updateDoc(compraDocRef, {
          active: false,
          closedAt: new Date()
        });
        setCurrentCompraId(null);
        setIsCreatingCompra(false);
        setShoppingList([]);
      } catch (error) {
        console.error('Error closing compra:', error);
      }
    }
  };

  const handleShowHistory = async () => {
    if (familyId) {
      try {
        const listasComprasRef = collection(db, `familiasDB/${familyId}/listasCompras`);
        const historyQuery = query(listasComprasRef, where("active", "==", false), orderBy("closedAt", "desc"));
        const querySnapshot = await getDocs(historyQuery);
        
        const history = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            closedAt: data.closedAt ? data.closedAt.toDate().toLocaleDateString() : 'Fecha desconocida',
            total: data.total || 0,
            items: data.items || []
          };
        });
        
        setHistoryList(history);
        setShowingHistory(true);
        setIsCreatingCompra(false);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    }
  };

  const handleItemNameChange = (e) => setItemName(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography color={'primary'} variant="h6">
          {showingHistory ? "Historial de Compras" : isCreatingCompra ? "Lista de Compras Activa" : "Lista de Compras"}
        </Typography>
        
        <IconButton onClick={handleShowHistory} color="primary">
          <HistoryIcon />
        </IconButton>
      </Box>

      {!isCreatingCompra && !showingHistory && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleCrearCompra}>
            Crear Nueva Compra
          </Button>
        </Box>
      )}

      {isCreatingCompra && (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre del artículo"
              variant="outlined"
              value={itemName}
              onChange={handleItemNameChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Cantidad"
              variant="outlined"
              value={quantity}
              onChange={handleQuantityChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Peso"
              variant="outlined"
              value={weight}
              onChange={handleWeightChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Marca"
              variant="outlined"
              value={brand}
              onChange={handleBrandChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={handleAddItem}>
                Agregar Item
              </Button>
              <Button variant="contained" color="success" onClick={handleCerrarCompra}>
                Cerrar Compra
              </Button>
            </Box>
          </Box>
          <List sx={{ mt: 4 }}>
            {shoppingList.map((item, index) => (
              <ListItem key={index} divider sx={{ boxShadow: 2 }}>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{`${item.weight}`}</span>
                      <span>{`Cant: ${item.quantity}`}</span>
                      <span>{`Marca: ${item.brand}`}</span>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      {showingHistory && (
        <List sx={{ mt: 4 }}>
          {historyList.map((compra, index) => (
            <ListItem key={index} divider sx={{ boxShadow: 2 }}>
              <ListItemText
                primary={`Compra del ${compra.closedAt}`}
                secondary={
                  <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{`Total: $${compra.total.toFixed(2)}`}</span>
                    <span>{`Items: ${compra.items.length}`}</span>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ListaCompras;