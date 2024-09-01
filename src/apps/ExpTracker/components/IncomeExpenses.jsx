import React, { useContext } from 'react';
import { Card, Box, Typography, CardContent } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { GlobalContext } from '../context/GlobalState';

//Money formatter function
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

export const IncomeExpenses = () => {
  const { transactions } = useContext(GlobalContext);

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
            <ArrowUpward sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="text">Ingresos Viejo:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(incomeThisMonth)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ minWidth: 200, mx: 1 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)',
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: 6,
            color: 'white',
          }}
        >
          <CardContent>
            <ArrowDownward sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="test">Gastos Viejo:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {moneyFormatter(expenseThisMonth)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};