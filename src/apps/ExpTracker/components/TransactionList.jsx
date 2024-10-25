import React, { useContext, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
import { Delete as DeleteIcon, ArrowUpward as IncomeIcon, ArrowDownward as ExpenseIcon } from '@mui/icons-material';

import { Transaction } from './Transaction';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, deleteTransaction } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filtrar transacciones para asegurar que todos los ids sean únicos
  const uniqueTransactions = transactions.filter((transaction, index, self) =>
    index === self.findIndex((t) => t.id === transaction.id)
  );
  // Ordenar las transacciones de más nuevas a más viejas
  const sortedTransactions = uniqueTransactions.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
    }
    handleClose();
  };


  return (
    <>
      <List>
        {sortedTransactions.map(transaction => (
          <ListItem
            key={transaction.id}
            sx={{
              borderLeft: `5px solid ${transaction.amount > 0 ? '#4caf50' : '#f44336'}`,
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              mb: 2,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        color: transaction.amount > 0 ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                      }}
                    >
                      ${transaction.amount.toFixed(2)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      {transaction.category} - {new Date(transaction.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {transaction.amount > 0 ? (
                  <IncomeIcon sx={{ color: '#4caf50', mr: 2 }} />
                ) : (
                  <ExpenseIcon sx={{ color: '#f44336', mr: 2 }} />
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDeleteClick(transaction)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Modal de Confirmación */}
      <Dialog open={open} onClose={handleClose} aria-hidden={!open}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que quieres eliminar esta transacción?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error">
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};