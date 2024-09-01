import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import './Contador.css'; // Asegúrate de importar el CSS
import FosforoIMG from './img/fosforo.png';
import { auth } from '../../../data/firebase'; // Asegúrate de importar la autenticación
import useFirestore from '../../../customHooks/useFirestore'; // Importa el hook useFirestore
import { format } from 'date-fns';

const Contador = () => {
  const [numero, setNumero] = useState(0);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const { data, loading, error, updateData, setDataDoc } = useFirestore('users', userId);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (data && !data.contadores) {
      setDataDoc({ contadores: {} });
    }
  }, [data]);

  const updateContadores = async (newNumero) => {
    if (!userId) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const contadores = data.contadores || {};

    contadores[today] = newNumero;

    await updateData({ contadores });
  };

  const agregar = (cantidad = 1) => {
    setNumero(prevNumero => {
      const newNumero = prevNumero + cantidad;
      updateContadores(newNumero);
      return newNumero;
    });
  };

  const restar = (cantidad = 1) => {
    setNumero(prevNumero => {
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
        {grupo.map(fosforo => (
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
        <Button variant="contained" color="success" onClick={() => agregar(1)} sx={{ m: 1 }}>
          Agregar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => restar(1)} sx={{ m: 1 }}>
          Restar
        </Button>
        <Button variant="outlined" color="error" onClick={() => reset()} sx={{ m: 1 }}>
          Reset
        </Button>
        <Typography 
          variant="h5" 
          component="div"
          sx={{ m: 2 }} >
          Por ahora: {numero}
        </Typography>
        <Button variant="outlined" color="primary" onClick={reset} sx={{ m: 1 }}>
          Cerrar el dia
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
        <Typography variant="h2" component="div" >
          {renderFosforos()}
        </Typography>
      </Box>
    </Container>
  );
};

export default Contador;


// import React, { useState } from 'react';
// import { Container, Box, Button, IconButton, Typography } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
// import { useNavigate } from 'react-router-dom';

// const Contador = () => {
//   const [count, setCount] = useState(0);
//   const navigate = useNavigate();

//   const handleGoHome = () => {
//     navigate('/');
//   };

//   const handleAgregar = () => {
//     setCount(count + 1);
//   }
//   const handleSacar = () => {
//     setCount(count - 1);
//   }

//   return (
//     <Container>
//       <IconButton
//         onClick={handleGoHome}
//         sx={{
//           position: 'absolute',
//           top: 16,
//           left: 16,
//           color: 'white',
//         }}
//       >
//         <HomeIcon />
//       </IconButton>
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         height="100vh"
//       >

// <Box mt={2}>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={handleAgregar} 
//             sx={{ m: 1 }}>
//             Sumar
//           </Button>
//           <Button 
//             variant="contained" 
//             color="secondary" 
//             onClick={handleSacar} 
//             sx={{ m: 1 }}>
//             Restar
//           </Button>


//           <Typography variant="h2" component="div">
//             {count}
//           </Typography>
        
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Contador;