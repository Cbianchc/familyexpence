import React, { useContext, useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../data/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
import { GlobalContext } from '../ExpTracker/context/GlobalState';

const defaultTheme = createTheme();

const JoinFamily = () => {
  const [familyId, setFamilyId] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  // const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleJoinFamily = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'familiasusers', user.uid));
        const userData = userDoc.data();
  
        if (userData && userData.username) {
          const username = userData.username;
  
          const familyRef = doc(db, 'familiasDB', familyId);
          const familySnap = await getDoc(familyRef);
          
          if (familySnap.exists()) {
            // Agregar el usuario a la subcolección 'miembros' de la familia
            await setDoc(doc(familyRef, 'miembros', user.uid), {
              id: user.uid,
              name: username,
              email: user.email,
            });
  
            // Actualizar el documento del usuario con el ID de la familia
            await updateDoc(doc(db, 'familiasusers', user.uid), {
              familyId: familyId,
            });
  
            navigate('/dashboard');
          } else {
            setErrorMsg('Grupo no encontrado');
          }
        } else {
          setErrorMsg('Usuario no encontrado o sin nombre de usuario');
        }
      } else {
        setErrorMsg('Usuario no autenticado');
      }
    } catch (error) {
      setErrorMsg('Error al unirse a la familia: ' + error.message);
      console.error('Error al unirse a la familia:', error);
    }
  };

  const handleCreateFamily = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setErrorMsg('Usuario no autenticado');
        return;
      }

      const userDocRef = doc(db, 'familiasusers', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (!userData || !userData.username) {
        setErrorMsg('Usuario no encontrado o sin nombre de usuario');
        return;
      }
      const username = userData.username;

      const familyId = `${newFamilyName}_${user.uid}`;
      const familyRef = doc(db, 'familiasDB', familyId);

      await setDoc(familyRef, { name: newFamilyName });

      await setDoc(doc(familyRef, 'miembros', user.uid), {
        id: user.uid,
        name: username,
        email: user.email,
      });

      // Crear las subcolecciones 'gastos' y 'categorias' con documentos 
      const newGastoRef = doc(collection(familyRef, 'gastos')); // Esto genera un ID único automáticamente

      await setDoc(newGastoRef, {
        amount: -50,
        category: 'transaccion ejemplo',
        text: '100',
        id: "1Test",
      });

      await setDoc(doc(familyRef, 'categorias', 'categoriaInicial'), {
        name: 'Categoría inicial'
      });

      await setDoc(doc(familyRef, 'listasCompras', 'compraInicial'), {
        name: 'Categoría inicial'
      });
  
      // Agrega categorías iniciales
      const initialCategories = ['Sueldo 1', 'Alquiler', 'Expensas', 'Gas', 'Luz', 'Agua', 'Netflix', 'Comida'];
      for (let category of initialCategories) {
        await setDoc(doc(familyRef, 'categorias', category), {
          name: category
        });
      }

      await setDoc(userDocRef, { familyId }, { merge: true });

      navigate('/dashboard');
    } catch (error) {
      setErrorMsg('Error al crear la familia: ' + error.message);
      console.error('Error al crear la familia: ', error);
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <FamilyRestroomIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              PASO 2:
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
                Sumarme a una familia
              </Typography>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Family ID"
                autoComplete="family-id"
                autoFocus
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleJoinFamily}
                sx={{ mt: 4 }}
              >
                Unirse a la Familia
              </Button>
              <Typography component="h2" variant="h6" sx={{ mt: 8 }}>
                O crea tu propia familia
              </Typography>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Nuevo Nombre de Familia"
                autoComplete="new-family-name"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCreateFamily}
                sx={{ mt: 4 }}
              >
                Crear Familia
              </Button>
              {errorMsg && <Typography color="error" sx={{ mt: 2 }}>{errorMsg}</Typography>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default JoinFamily;
