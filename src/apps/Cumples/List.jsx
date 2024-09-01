import React, { useState } from 'react';
import { parseISO, format, compareAsc } from 'date-fns';
import { es } from 'date-fns/locale';
import { ListItem, ListItemAvatar, Avatar, Button, Box, Typography } from '@mui/material';
import './List.css';
import ModalList from './modal/ModalList.jsx';

export default function CustomList({ info, upcoming }) {
  // console.log("Received info in CustomList:", info);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const normalizeData = (data) => {

    return data.map(item => ({
      id: item.id || '',
      name: item.name || '',
      date: item.date || '',
      type: item.type || '',
      eventType: item.eventType || '',
      admin: item.admin || '',
      description: item.description || '',
      participants: item.participants || [],
      img: item.img || '',
      officeId: item.officeId || ''  
    }));
  };

  const sortedInfo = normalizeData(info).sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    // Comparar solo mes y día, ignorando el año
    return compareAsc(
      new Date(0, dateA.getMonth(), dateA.getDate()),
      new Date(0, dateB.getMonth(), dateB.getDate())
    );
  });

  return (
    <>
      <ul className="list">
        {iterate(sortedInfo, upcoming, handleOpen)}
      </ul>
      {selectedItem && (
        <ModalList 
          open={open} 
          handleClose={handleClose} 
          selectedItem={selectedItem} />
      )}
    </>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  try {
    // Convierte la cadena de fecha en un objeto Date
    const date = parseISO(dateString);
    // Formatea la fecha en el formato "dd de mmm"
    return format(date, "d 'de' MMMM", { locale: es });
  } catch (error) {
    console.error("Error parsing date:", error);
    return 'Fecha no disponible';
  }
}

function iterate(data, flag, handleOpen) {
  if (!data) return;
  const bgColor = flag ? { backgroundColor: "#ffe66d" } : {};
  // console.log("Events in List with officeId:", data);

  return (
    <>
      {data.map((item, index) => (
        <Box
          key={index}
          style={bgColor}
          sx={{
            marginTop: 2,
            boxShadow: 4,
            marginBottom: 2,
            borderRadius: 3,
            padding: 2,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: bgColor.backgroundColor || '#a2cf6e'
          }}>
          <ListItem style={{ padding: 0 }}>
            <ListItemAvatar>
              <Avatar src={item.img} />
            </ListItemAvatar>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" component="div" color="text.primary">
                {item.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {formatDate(item.date)}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              style={{ marginLeft: 'auto' }}
              onClick={() => handleOpen(item)} 
            >
              Abrir
            </Button>
          </ListItem>
        </Box>
      ))}
    </>
  );
}


