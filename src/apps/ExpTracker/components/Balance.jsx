import React, { useContext } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

import { GlobalContext } from '../context/GlobalState';

//Money formatter function
function moneyFormatter(num) {
  let p = num.toFixed(2).split('.');
  return (
    '$ ' + (p[0].split('')[0]=== '-' ? '-' : '') +
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

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);

  return (
    <Paper 
      elevation={5} 
      sx={{ 
        padding: '24px', 
        textAlign: 'center', 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #00bfa5 30%, #1de9b6 90%)', 
        color: '#ffffff', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box sx={{ position: 'absolute', top: -25, right: -25, opacity: 0.1 }}>
        <AttachMoney sx={{ fontSize: 120 }} />
      </Box>
      <Typography variant="h6" sx={{ fontSize: 22, fontWeight: 500 }}>Balance</Typography>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 'bold', 
          mt: 1,
          color: total >= 0 ? '#76ff03' : '#ff1744',
        }}
      >
        ${total}
      </Typography>
    </Paper>
  );
};
