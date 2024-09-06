import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Tooltip,
  Button
} from '@mui/material';
import { ArrowUpward, ArrowDownward, PieChart, Star, Close } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { GlobalContext } from '../context/GlobalState';

//Funcion para formatear moneda
function moneyFormatter(num) {
  let p = num.toFixed(2).split('.');
  return (
    '$ ' +
    p[0]
      .split('')
      .reverse()
      .reduce(function (acc, num, i, orig) {
        return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
      }, '') +
    '.' +
    p[1]
  );
}

// Función para formatear fechas
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const IncomeExpenses = (user) => {
  const { transactions } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [openUserTransactions, setOpenUserTransactions] = useState(false);

  const amounts = transactions.map(transaction => transaction.amount);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  );


  // Obtener el mes y año actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filtrar transacciones del mes actual
  const transactionsThisMonth = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.timestamp);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // Calcular ingresos y gastos del mes actual
  const amountsThisMonth = transactionsThisMonth.map(transaction => transaction.amount);

  const incomeThisMonth = amountsThisMonth
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expenseThisMonth = (
    amountsThisMonth
      .filter(item => item < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
  );

  // Filtrar solo los gastos fijos
  const fixedExpenses = transactions
    .filter(transaction => !transaction.isIncome && transaction.isFixedExpense)
    .map(transaction => transaction.amount)
    .reduce((acc, item) => (acc += item), 0);

  const incomeTransactions = transactionsThisMonth.filter(transaction => transaction.amount > 0);
  const expenseTransactions = transactionsThisMonth.filter(transaction => transaction.amount < 0);

  // Filtrar las transacciones del usuario actual
  const userTransactions = transactions.filter(transaction => transaction.user === user.user.username);

  // Funciones para abrir/cerrar modales
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUserTransactionsOpen = () => setOpenUserTransactions(true);
  const handleUserTransactionsClose = () => setOpenUserTransactions(false);

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',

            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
            cursor: 'pointer' // Cambia el cursor para indicar que es clickeable
          }}
          onClick={handleOpen} // Al hacer clic, abre el modal
        >
          <CardContent>
            <PieChart sx={{ fontSize: 40, mb: 1 }} /> {/* Gráfico de torta simulado */}
            <Typography variant="text">Resumen mes:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(incomeThisMonth)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Nueva tarjeta "Mis Gastos" */}
      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)',
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={handleUserTransactionsOpen}
        >
          <CardContent>
            <PriceCheckIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="text">Mis Gastos:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(userTransactions.filter(t => t.amount < 0).reduce((acc, t) => (acc += t.amount), 0) * -1)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #43CBFF 100%)',

            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
          }}
        >
          <CardContent>
            <ArrowUpward sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="text">Ingresos Mes:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(incomeThisMonth)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
          }}
        >
          <CardContent>
            <ArrowDownward sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="text">Gastos Mes:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(expenseThisMonth)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)',
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
          }}
        >
          <CardContent>
            <ArrowDownward sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="text">Gastos Fijos:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(fixedExpenses)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Modal con el resumen de gastos e ingresos */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Cashflow
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Tabla de ingresos y gastos */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="text" sx={{ fontWeight: 'bold', color: 'green', mb: 1, mr: 4 }}>Ingresos</Typography>
              <Typography variant="text" sx={{ fontWeight: 'bold', color: 'green', pl: 3 }}>
                {moneyFormatter(incomeThisMonth)}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#E0F2F1' }}>Categoria</TableCell>
                    <TableCell sx={{ backgroundColor: '#E0F2F1' }}>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{moneyFormatter(transaction.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="text" sx={{ fontWeight: 'bold', color: 'red', mb: 1, mr: 4 }}>Gastos</Typography>
              <Typography variant="text" sx={{ fontWeight: 'bold', color: 'red', pl: 3 }}>
                {moneyFormatter(fixedExpenses)}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#FFEBEE' }}>Categoria</TableCell>
                    <TableCell sx={{ backgroundColor: '#FFEBEE' }}>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {transaction.category}
                        {transaction.isFixedExpense && (
                          <Tooltip title="Gasto fijo" placement="right">
                            <Star sx={{ color: 'gold', ml: 1, fontSize: 16 }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{moneyFormatter(transaction.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal con las transacciones del usuario */}
      <Dialog open={openUserTransactions} onClose={handleUserTransactionsClose} fullWidth maxWidth="md">
        <DialogTitle>
          Mis Movimientos
          <IconButton
            aria-label="close"
            onClick={handleUserTransactionsClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell sx={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                  {moneyFormatter(transaction.amount)}
                  {transaction.amount > 0 ? (
                    <ArrowUpward sx={{ color: 'green', ml: 1, fontSize: 16 }} />
                  ) : (
                    <ArrowDownward sx={{ color: 'red', ml: 1, fontSize: 16 }} />
                  )}
                  </TableCell>
                  <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
};