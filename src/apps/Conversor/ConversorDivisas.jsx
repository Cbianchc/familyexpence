import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // Morado
    },
    secondary: {
      main: '#03dac6', // Cian
    },
    background: {
      default: '#f5f5f5', // Gris claro
    },
    text: {
      primary: '#212121', // Negro
    },
  },
});

const ConversorDivisas = () => {
  const [monto, setMonto] = useState(0);
  const [monedaOrigen, setMonedaOrigen] = useState('ARS');
  const [monedaDestino, setMonedaDestino] = useState('USD');
  const [cotizaciones, setCotizaciones] = useState({});
  const [resultado, setResultado] = useState(0);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setCotizaciones(data.rates);
    };
    fetchCotizaciones();
  }, []);

  const handleMontoChange = (event) => {
    setMonto(event.target.value);
  };

  const handleMonedaOrigenChange = (event) => {
    setMonedaOrigen(event.target.value);
  };

  const handleMonedaDestinoChange = (event) => {
    setMonedaDestino(event.target.value);
  };

  const handleConvertir = () => {
    if (cotizaciones) {
      const resultado = (monto / cotizaciones[monedaOrigen]) * cotizaciones[monedaDestino];
      setResultado(resultado);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 5 }}>

        <Typography variant="h4" component="h1" color={'primary'} gutterBottom align="center">
          Conversor de Divisas
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Monto"
            type="number"
            value={monto}
            onChange={handleMontoChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ bgcolor: 'white' }} // Cambia el fondo a blanco
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Moneda Origen</InputLabel>
            <Select
              value={monedaOrigen}
              onChange={handleMonedaOrigenChange}
              label="Moneda Origen"
              sx={{ bgcolor: 'white' }} // Cambia el fondo a blanco
            >
              <MenuItem value="ARS">Pesos Argentinos</MenuItem>
              <MenuItem value="USD">Dólar USA</MenuItem>
              <MenuItem value="EUR">Euro</MenuItem>
              <MenuItem value="PEN">Sol Peruano</MenuItem>
              <MenuItem value="COP">Peso Colombiano</MenuItem>
              <MenuItem value="CLP">Peso Chileno</MenuItem>
              <MenuItem value="UYU">Peso Uruguayo</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Moneda Destino</InputLabel>
            <Select
              value={monedaDestino}
              onChange={handleMonedaDestinoChange}
              label="Moneda Destino"
            >
              <MenuItem value="ARS">Pesos Argentinos</MenuItem>
              <MenuItem value="USD">Dólar USA</MenuItem>
              <MenuItem value="EUR">Euro</MenuItem>
              <MenuItem value="PEN">Sol Peruano</MenuItem>
              <MenuItem value="COP">Peso Colombiano</MenuItem>
              <MenuItem value="CLP">Peso Chileno</MenuItem>
              <MenuItem value="UYU">Peso Uruguayo</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConvertir}
            sx={{ mt: 3, borderRadius: 20 }} // Añade bordes redondeados
            fullWidth
          >
            Convertir
          </Button>
        </Box>
        <Typography variant="h6" component="p" sx={{ mt: 4, textAlign: 'center' }}>
          Resultado: {resultado.toFixed(2)}
        </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default ConversorDivisas;

