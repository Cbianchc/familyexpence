import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { auth, db } from '../../../data/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

Modal.setAppElement('#root'); // Ajusta según el elemento raíz de tu aplicación

export default function ModalCumple() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isForAll, setIsForAll] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    participants: [],
    admin: auth.currentUser?.displayName || 'defaultAdmin',
    eventType: '',
    price: '',
    descripcion: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        if (user.displayName) {
          setLoggedInUser(user.displayName);
        } else {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setLoggedInUser(userData.username || user.email);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setNewEvent(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
      admin: loggedInUser // Asegúrate de que creador siempre tenga el valor de loggedInUser
    }));
  };;

  const handleAddParticipant = () => {
    setNewEvent({ ...newEvent, participants: [...newEvent.participants, ''] });
  };

  const handleParticipantChange = (index, value) => {
    const updatedParticipants = [...newEvent.participants];
    updatedParticipants[index] = value;
    setNewEvent({ ...newEvent, participants: updatedParticipants });
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const offices = userData.offices || [];

          const updatedEvent = { ...newEvent, admin: loggedInUser || 'defaultAdmin' };
        console.log('updatedEvent:', updatedEvent);

          for (const office of offices) {
            const officeDoc = await getDoc(doc(db, 'offices', office));
            if (officeDoc.exists()) {
              const officeData = officeDoc.data();
              let birthdays = officeData.birthdays || {}; // Inicializar como un objeto vacío si no existe

              // Si el cumpleaños ya existe, actualiza sus datos
              if (birthdays[newEvent.name]) {
                birthdays[newEvent.name] = { ...birthdays[newEvent.name], ...newEvent };
              } else {
                // Si el cumpleaños no existe, agregalo al objeto
                birthdays[newEvent.name] = newEvent;
              }
              console.log('Updating birthdays with:', birthdays);

              await updateDoc(doc(db, 'offices', office), { birthdays });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      console.log('loggedInUser:', loggedInUser);

      setModalOpen(false);
    }
  };

  const handleForAllChange = (event) => {
    setIsForAll(event.target.value === 'true');
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Agregar Evento
      </Button>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <Typography variant="h6" component="h2">
          Crear nuevo evento
        </Typography>
        <TextField name="name" label="Nombre" onChange={handleChange} fullWidth margin="normal" />
        <TextField name="date" label="Fecha" type="date" onChange={handleChange} fullWidth margin="normal" />
        
        <RadioGroup row value={isForAll.toString()} onChange={handleForAllChange}>
          <FormControlLabel value="true" control={<Radio />} label="Para todos" />
          <FormControlLabel value="false" control={<Radio />} label="Para algunos..." />
        </RadioGroup>

        {!isForAll && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Participantes</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newEvent.participants.map((participant, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField 
                        value={participant} 
                        onChange={(e) => handleParticipantChange(index, e.target.value)} 
                        fullWidth 
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleParticipantChange(index, '')}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {!isForAll && (
          <Button onClick={handleAddParticipant}>Agregar Participante</Button>
        )}

        <TextField name="admin" label="Creador" value={loggedInUser} disabled fullWidth margin="normal" />
        <TextField name="eventType" label="Tipo de Evento" onChange={handleChange} fullWidth margin="normal" />
        <TextField name="price" label="Precio" type="number" onChange={handleChange} fullWidth margin="normal" />
        <TextField name="descripcion" label="Descripción" multiline rows={4} onChange={handleChange} fullWidth margin="normal" />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Crear
        </Button>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </>
  );
}


