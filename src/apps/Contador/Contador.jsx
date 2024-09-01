import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent, CardActions, IconButton, TextField } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../data/firebase';
import './Contador.css';
import FosforoIMG from './img/fosforo.png';
import { format } from 'date-fns';

const Contador = () => {
  const [numero, setNumero] = useState(0);
  const [userId, setUserId] = useState(null);
  const [historial, setHistorial] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserData(user.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.contadores) {
          const today = format(new Date(), 'yyyy-MM-dd');
          setNumero(userData.contadores[today] || 0);
          setHistorial(userData.contadores);
        } else {
          await setDoc(userDocRef, { contadores: {} }, { merge: true });
        }
      } else {
        await setDoc(userDocRef, { contadores: {} });
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContadores = async (newNumero, date) => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    const fecha = date || format(new Date(), 'yyyy-MM-dd');

    try {
      await updateDoc(userDocRef, {
        [`contadores.${fecha}`]: newNumero,
      });
      setHistorial((prevHistorial) => ({
        ...prevHistorial,
        [fecha]: newNumero,
      }));
    } catch (err) {
      setError(err);
      console.error('Error updating contadores:', err);
    }
  };

  const agregar = (cantidad = 1) => {
    setNumero((prevNumero) => {
      const newNumero = prevNumero + cantidad;
      updateContadores(newNumero);
      return newNumero;
    });
  };

  const restar = (cantidad = 1) => {
    setNumero((prevNumero) => {
      const newNumero = Math.max(0, prevNumero - cantidad);
      updateContadores(newNumero);
      return newNumero;
    });
  };

  const reset = () => {
    setNumero(0);
    updateContadores(0);
  };

  const renderFosforos = () => {
    const grupos = [];
    for (let i = 0; i < numero; i++) {
      if (i % 5 === 0) {
        grupos.push([]);
      }
      grupos[grupos.length - 1].push(i);
    }

    return grupos.map((grupo, index) => (
      <div key={index} className="grupo">
        {grupo.map((fosforo) => (
          <img
            key={fosforo}
            className={`fosforo fosforo${(fosforo % 5) + 1}`}
            src={FosforoIMG}
            alt="Fósforo"
          />
        ))}
      </div>
    ));
  };

  const renderHistorial = () => {
    const fechas = Object.keys(historial).sort((a, b) => new Date(b) - new Date(a));
    return (
      <List sx={{ maxWidth: '400px', minWidth: '95%'}}>
        {fechas.map((fecha) => (
          <Card 
						key={fecha} 
						sx={{ 
							marginTop: 2,
							marginX: 2,
            boxShadow: 4,
            marginBottom: 2,
            borderRadius: 3,
            padding: 2,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#a2cf6e'  
						}}>
            <CardContent sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Typography variant="h6">
                El dia: {fecha}
              </Typography>
              <Typography variant="h6" sx={{marginRight: 3}}>
                Hiciste: {historial[fecha]}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton color="primary" onClick={() => handleEdit(fecha)}>
                <EditIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </List>
    );
  };

  const handleEdit = (fecha) => {
    const newValue = prompt(`Editar valor para ${fecha}:`, historial[fecha]);
    if (newValue !== null) {
      const newNumero = parseInt(newValue, 10);
      if (!isNaN(newNumero)) {
        updateContadores(newNumero, fecha);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Container>
      <Button
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
        }}
      >
        <HomeIcon />
      </Button>

      <Box mt={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => agregar(1)}
          sx={{ m: 1 }}
        >
          Agregar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => restar(1)}
          sx={{ m: 1 }}
        >
          Restar
        </Button>
        <Button variant="outlined" color="error" onClick={() => reset()} sx={{ m: 1 }}>
          Reset
        </Button>
        <Typography variant="h5" component="div" sx={{ m: 2 }}>
          Por ahora: {numero}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={reset} sx={{ m: 1 }}>
          Cerrar el día
        </Button>
        <Button variant="outlined" color="primary" onClick={() => {}} sx={{ m: 1 }}>
          Historial
        </Button>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="start"
        height="100vh"
        mt={8}
      >
        <Typography variant="h2" component="div">
          {renderFosforos()}
        </Typography>
        {renderHistorial()}
      </Box>
    </Container>
  );
};

export default Contador;



