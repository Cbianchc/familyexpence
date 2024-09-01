import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const DividirGastos = () => {
  const [billAmount, setBillAmount] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [tipType, setTipType] = useState('percentage');
  const [fixedTipAmount, setFixedTipAmount] = useState(0);
  const [result, setResult] = useState(0);

  const handleBillAmountChange = (e) => {
    setBillAmount(parseFloat(e.target.value));
  };

  const handleTipPercentageChange = (e) => {
    setTipPercentage(parseFloat(e.target.value));
  };

  const handleNumberOfGuestsChange = (e) => {
    setNumberOfGuests(parseInt(e.target.value, 10));
  };

  const handleTipTypeChange = (e) => {
    setTipType(e.target.value);
  };

  const handleFixedTipAmountChange = (e) => {
    setFixedTipAmount(parseFloat(e.target.value));
  };

  const handleDivideBill = () => {
    let totalAmount = billAmount;
    if (tipType === 'percentage') {
      totalAmount += billAmount * (tipPercentage / 100);
    } else {
      totalAmount += fixedTipAmount;
    }
    const amountPerGuest = totalAmount / numberOfGuests;
    setResult(amountPerGuest);
  };

  const handleReset = () => {
    setBillAmount(0);
    setTipPercentage(0);
    setNumberOfGuests(1)
    setTipType('percentage');
    setFixedTipAmount(0)
    setResult(0);
  }

  return (
    <>
      <Typography variant="h5" color={'primary'} component="div" gutterBottom>
        Dividir la cuenta
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Monto de la cuenta"
            variant="outlined"
            type="number"
            step="0.01"
            fullWidth
            value={billAmount}
            onChange={handleBillAmountChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Tipo de propina</InputLabel>
            <Select
              value={tipType}
              onChange={handleTipTypeChange}
              label="Tipo de propina"
            >
              <MenuItem value="percentage">Porcentaje</MenuItem>
              <MenuItem value="fixed">Monto fijo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {tipType === 'percentage' ? (
          <Grid item xs={12}>
            <TextField
              label="Porcentaje de propina"
              variant="outlined"
              type="number"
              step="0.01"
              fullWidth
              value={tipPercentage}
              onChange={handleTipPercentageChange}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <TextField
              label="Monto fijo de propina"
              variant="outlined"
              type="number"
              step="0.01"
              fullWidth
              value={fixedTipAmount}
              onChange={handleFixedTipAmountChange}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="Número de comensales"
            variant="outlined"
            type="number"
            fullWidth
            value={numberOfGuests}
            onChange={handleNumberOfGuestsChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDivideBill}
          >
            Dividir
          </Button>
        </Grid>
      </Grid>
      {result > 0 && (
        <Grid>

          <Typography variant="h6" color="textPrimary" mt={5}>
            Cada comensal debe pagar: ${result.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => { }}
            sx={{ mt: 5 }}
          >
            ¿Agregar a tus gastos?
          </Button>
        </Grid>
      )}
      <Button
        variant="contained"
        color="warning"
        onClick={handleReset}
        sx={{ mt: 5 }}
      >
        Reiniciar
      </Button>
    </>
  );
};

export default DividirGastos;

