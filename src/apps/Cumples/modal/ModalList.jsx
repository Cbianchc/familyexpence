import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { auth, db } from '../../../data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    border: '2px solid #000',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    padding: '20px',
  },
};

export default function ModalList({ open, handleClose, selectedItem }) {
  const [isParticipant, setIsParticipant] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setLoggedInUser({ id: user.uid, name: userData.username || user.email });
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchOfficeData = async () => {
      if (selectedItem?.officeId) {
        try {
          const officeRef = doc(db, 'offices', selectedItem.officeId);
          const officeDoc = await getDoc(officeRef);
          if (officeDoc.exists()) {
            setOfficeData(officeDoc.data());
          }
        } catch (err) {
          console.error('Error fetching office data:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOfficeData();
  }, [selectedItem?.officeId]);

  useEffect(() => {
    if (selectedItem && officeData && loggedInUser) {
      const event = officeData.birthdays?.[selectedItem.name] || {};
      setIsParticipant(event.participants?.some(p => p.id === loggedInUser.id) || false);
      setParticipants(event.participants || []);
    }
  }, [selectedItem, officeData, loggedInUser]);

  if (!selectedItem) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = parseISO(dateString);
      return format(date, "d 'de' MMMM", { locale: es });
    } catch (error) {
      console.error("Error parsing date:", error);
      return 'Fecha no disponible';
    }
  };

  const handleParticipation = async () => {
    if (selectedItem && loggedInUser && selectedItem.officeId) {
      const eventRef = doc(db, 'offices', selectedItem.officeId);
      try {
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          let currentParticipants = eventData.birthdays?.[selectedItem.name]?.participants || [];

          if (isParticipant) {
            // Remove user if already participating
            currentParticipants = currentParticipants.filter(p => p.id !== loggedInUser.id);
          } else {
            // Add user if not participating
            currentParticipants.push({ id: loggedInUser.id, name: loggedInUser.name });
          }

          await updateDoc(eventRef, {
            [`birthdays.${selectedItem.name}.participants`]: currentParticipants
          });

          // Update local state
          setIsParticipant(!isParticipant);
          setParticipants(currentParticipants);

          // Update officeData state
          setOfficeData(prevData => ({
            ...prevData,
            birthdays: {
              ...prevData.birthdays,
              [selectedItem.name]: {
                ...prevData.birthdays[selectedItem.name],
                participants: currentParticipants
              }
            }
          }));
        }
      } catch (error) {
        console.error("Error updating participation:", error);
      }
    }
  };

  const handleSetAdmin = async () => {
    if (selectedItem && loggedInUser && selectedItem.officeId) {
      const eventRef = doc(db, 'offices', selectedItem.officeId);
      try {
        await updateDoc(eventRef, {
          [`birthdays.${selectedItem.name}.admin`]: loggedInUser.name
        });

        // Update local state
        setOfficeData(prevData => ({
          ...prevData,
          birthdays: {
            ...prevData.birthdays,
            [selectedItem.name]: {
              ...prevData.birthdays[selectedItem.name],
              admin: loggedInUser.name
            }
          }
        }));
        setIsAdmin(true); 

      } catch (error) {
        console.error("Error setting admin:", error);
      }
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleClose}
      style={modalStyle}
      contentLabel="Event Details"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src={selectedItem.img} sx={{ width: 100, height: 100, marginBottom: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          {selectedItem.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {formatDate(selectedItem.date)}
        </Typography>

        <Button
          variant="contained"
          color={isParticipant ? "secondary" : "primary"}
          sx={{ marginBottom: 1 }}
          onClick={handleParticipation}
        >
          {isParticipant ? "Dejar de Participar" : "Participar"}
        </Button>

        {isAdmin || officeData?.birthdays?.[selectedItem.name]?.admin ? (
          <Typography variant="subtitle1" gutterBottom>
            Admin: {officeData?.birthdays?.[selectedItem.name]?.admin}
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginBottom: 1 }}
            onClick={handleSetAdmin}
          >
            Ser Admin
          </Button>
        )}

        <Button variant="outlined" onClick={handleClose}>
          Cerrar
        </Button>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="subtitle1">Participantes:</Typography>
          {participants.length === 0 ? (
            <Typography variant="body1">Sin participantes...</Typography>
          ) : (
            participants.map((participant) => (
              <Typography key={participant.id} variant="body1">
                {participant.name}
              </Typography>
            ))
          )}
        </Box>
      </Box>
    </Modal>
  );
}
