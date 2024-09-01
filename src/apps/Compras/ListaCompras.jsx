import React, { useState, useEffect } from 'react';
import { auth, db } from '../../data/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, limit, orderBy, deleteDoc } from 'firebase/firestore';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [historyList, setHistoryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckBox = (index) => (event) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = event.target.checked;
    setCheckedItems(updatedCheckedItems);
  };

  useEffect(() => {
    // Configura los items chequeados al cargar la lista
    const initialCheckedItems = shoppingList.map(() => false);
    setCheckedItems(initialCheckedItems);
  }, [shoppingList]);

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
              await fetchHistoryList(userData.familyId);
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

  const fetchHistoryList = async (familyId) => {
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
    } catch (error) {
      console.error('Error fetching history:', error);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTotalPrice('');
  };

  const handleCerrarCompra = async () => {
    if (currentCompraId && totalPrice) {
      try {
        const compraDocRef = doc(db, `familiasDB/${familyId}/listasCompras`, currentCompraId);
        await updateDoc(compraDocRef, {
          active: false,
          closedAt: new Date(),
          total: parseFloat(totalPrice)
        });
        setCurrentCompraId(null);
        setIsCreatingCompra(false);
        setShoppingList([]);
        await fetchHistoryList(familyId);
        handleCloseModal();
      } catch (error) {
        console.error('Error closing compra:', error);
      }
    }
  };

  const handleDeleteClick = (compra) => {
    setSelectedCompra(compra);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (compra) => {
    setSelectedCompra(compra);
    setEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCompra && familyId) {
      try {
        await deleteDoc(doc(db, `familiasDB/${familyId}/listasCompras`, selectedCompra.id));
        await fetchHistoryList(familyId);
        setDeleteModalOpen(false);
        setSelectedCompra(null);
      } catch (error) {
        console.error('Error deleting compra:', error);
      }
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedCompra(null);
  };

  const handleRepeatCompra = async () => {
    if (selectedCompra && familyId) {
      try {
        const listasComprasRef = collection(db, `familiasDB/${familyId}/listasCompras`);
        const newCompraDoc = await addDoc(listasComprasRef, {
          createdAt: new Date(),
          items: selectedCompra.items,
          active: true
        });
        setCurrentCompraId(newCompraDoc.id);
        setIsCreatingCompra(true);
        setShoppingList(selectedCompra.items);
        handleEditClose();
      } catch (error) {
        console.error('Error creating new compra:', error);
      }
    }
  };

  const handleDeleteItemConfirm = async () => {
    if (selectedCompra && familyId) {
      // try {
      //   await deleteDoc(doc(db, `familiasDB/${familyId}/listasCompras`, selectedCompra.id));
      //   await fetchHistoryList(familyId);
      //   setDeleteModalOpen(false);
      //   setSelectedCompra(null);
      // } catch (error) {
      //   console.error('Error deleting compra:', error);
      // }
      console.log(selectedCompra)
    }
  };

  const handleItemNameChange = (e) => setItemName(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);
  const handleTotalPriceChange = (e) => setTotalPrice(e.target.value);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography color={'primary'} variant="h6">
          {isCreatingCompra ? "Lista de Compras Actual" : "No hay compra activas"}
        </Typography>
      </Box>

      {!isCreatingCompra && (
        <>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleCrearCompra}>
              Crear Nueva Compra
            </Button>
          </Box>
          <Typography variant="h6" color={'primary'} sx={{ mt: 4, mb: 2 }}>Historial de Compras</Typography>
          <List sx={{ mt: 2 }}>
            {historyList.map((compra, index) => (
              <ListItem
                key={index}
                divider
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  boxShadow: 2,
                  padding: '16px 24px',
                }}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="view" sx={{ color: 'primary.main', mr: 1 }} onClick={() => handleEditClick(compra)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" sx={{ color: 'error.main', mr: 1 }} onClick={() => handleDeleteClick(compra)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={<Typography variant="h6" color={'primary'} sx={{ fontWeight: 'bold' }}>{`Compra del ${compra.closedAt}`}</Typography>}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                      <Typography variant="body2">{`Total: $${compra.total.toFixed(2)}`}</Typography>
                      <Typography variant="body2">{`Items: ${compra.items.length}`}</Typography>
                    </Box>
                  }
                />
              </ListItem>

            ))}
          </List>
        </>
      )}

      {isCreatingCompra && (
        <>
          {/* <Button variant="contained" color="warning" sx={{ mb: 4 }} onClick={() => {}}>
            Historial
          </Button> */}
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
              <Button variant="contained" color="success" onClick={handleOpenModal}>
                Cerrar Compra
              </Button>

            </Box>
          </Box>
          <List sx={{ mt: 4 }}>
            {shoppingList.map((item, index) => (
              <ListItem
                key={index}
                divider
                sx={{ color: 'black', boxShadow: 2 }}
              >
                <Checkbox
                  checked={checkedItems[index] || false}
                  onChange={handleCheckBox(index)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
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
                <IconButton edge="end" aria-label="delete" sx={{ color: 'error.main' }} onClick={() => handleDeleteClick(compra)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{"¿Cerramos la compra?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingregar precio total de la compra.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Precio Total"
            type="number"
            fullWidth
            variant="standard"
            value={totalPrice}
            onChange={handleTotalPriceChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleCerrarCompra} disabled={!totalPrice}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminación */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>{"¿Seguro que quieres eliminarlo?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. ¿Queres eliminar esta compra?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edición/Visualización */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{"Detalles de la Compra"}</DialogTitle>
        <DialogContent>
          {selectedCompra && (
            <>
              <Typography variant="h6">Fecha: {selectedCompra.closedAt}</Typography>
              <Typography variant="h6">Total: ${selectedCompra.total.toFixed(2)}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Lista de Productos:</Typography>
              <List>
                {selectedCompra.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Cantidad: ${item.quantity}, Peso: ${item.weight}, Marca: ${item.brand}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cerrar</Button>
          <Button onClick={handleRepeatCompra} color="primary" variant="contained">
            Repetir Compra
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Elimina un item en especifico */}
      <Dialog
        open={deleteItemModalOpen}
        onClose={() => setDeleteItemModalOpen(false)}
      >
        <DialogTitle>{"¿Seguro que querés eliminarlo?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. ¿Queres eliminar este ítem?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteItemModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteItemConfirm} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListaCompras;