import React, { useState, useContext, useEffect } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, TextField, Grid, MenuItem } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../../data/firebase';
import { v4 as uuidv4 } from 'uuid';

import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = ({ familyId }) => {
  const [open, setOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(true);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const { addTransaction } = useContext(GlobalContext);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = collection(db, `familiasDB/${familyId}/categorias`);
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
      setCategories(categoriesList);
    };

    fetchCategories();
  }, [familyId]);

  const handleClickOpen = (type) => {
    setIsIncome(type === 'income');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCategoryDialogOpen = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
    setNewCategory('');
  };

  const handleAddCategory = async () => {
    try {
      const categoryRef = doc(db, `familiasDB/${familyId}/categorias`, newCategory);
      await setDoc(categoryRef, { name: newCategory });
      setCategories(prevCategories => [...prevCategories, newCategory]);
      handleCategoryDialogClose();
    } catch (error) {
      console.error('Error al agregar la categoría: ', error);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const newTransaction = {
      id: uuidv4(),
      text,
      amount: isIncome ? +amount : -amount,
      category,
      timestamp: new Date().toISOString(),
    };

    addTransaction(newTransaction);
    setText('');
    setAmount(0);
    setCategory('');
    handleClose();
    setIsSubmitting(false);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleClickOpen('income')}
            sx={{
              borderRadius: 10,
              height: 70,
              boxShadow: 10,
              background: 'linear-gradient(135deg, #43CBFF 0%, #4CAF50 100%)',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                background: 'linear-gradient(135deg, #4CAF50 0%, #43CBFF 100%)',
                boxShadow: 12,
              },
            }}
          >
            <ArrowUpward sx={{ fontSize: 25 }} />
            Ingreso
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleClickOpen('expense')}
            sx={{
              borderRadius: 10,
              height: 70,
              boxShadow: 10,
              background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                background: 'linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%)',
                boxShadow: 12,
              },
            }}
          >
            <ArrowDownward sx={{ fontSize: 25 }} />
            Gasto
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth aria-hidden={!open} >
        <DialogTitle>{isIncome ? 'Agregar Ingreso' : 'Agregar Gasto'}</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <TextField
              label="Monto"
              type="number"
              fullWidth
              value={amount}
              onChange={e => setAmount(e.target.value)}
              margin="dense"
            />
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={9}>
            <TextField
              label="Categoría"
              select
              fullWidth
              value={category}
              onChange={e => setCategory(e.target.value)}
              margin="dense"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCategoryDialogOpen}
                  sx={{ height: '100%', width: '100%' }}
                >
                  Nueva
                </Button>
              </Grid>
            </Grid>
            <TextField
              label="Descripción"
              fullWidth
              value={text}
              onChange={e => setText(e.target.value)}
              margin="dense"
            />
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color={isIncome ? 'success' : 'error'}>
                Agregar {isIncome ? 'Ingreso' : 'Gasto'}
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

{/* Modal para agregar una nueva categoría */}
      <Dialog open={categoryDialogOpen} onClose={handleCategoryDialogClose} fullWidth aria-hidden={!open}>
        <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Categoría"
            fullWidth
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            margin="dense"
          />
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
            >
              Agregar
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};