// src/components/RadioPlayer.jsx
import React, { useRef, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

const RadioPlayer = ({ url, name }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" component="div" gutterBottom>
        {name}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="300px"
        textAlign="center"
      >
        <audio ref={audioRef} src={url} />
        <Button
          variant="contained"
          color={isPlaying ? 'error' : 'primary'}
          onClick={handlePlayPause}
          sx={{ mb: 2 }}
        >
          {isPlaying ? 'Pausa' : 'Reproducir'}
        </Button>
        <Typography variant="body1">
          {isPlaying ? 'Reproduciendo' : 'Detenido'}
        </Typography>
      </Box>
    </Box>
  );
};

export default RadioPlayer;
