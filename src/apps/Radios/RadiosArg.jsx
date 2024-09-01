import React, { useState } from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import RadioPlayer from './RadioPlayer'

const Radios = () => {
  const navigate = useNavigate();
  const [selectedRadio, setSelectedRadio] = useState(''); 

  const EmisorasTemp = {
    aspen: {
      url: "https://playerservices.streamtheworld.com/api/livestream-redirect/ASPEN.mp3",
      name: "Aspen",
      img: "../../../public/logosRadios/aspoenlogo1.png"
    },
    los40: {
      url: "https://edge03.radiohdvivo.com/stream/los40",
      name: "Los 40",
      img: "../../../public/logosRadios/los40logo1.png"
    },
    blue: {
      url: "http://playerservices.streamtheworld.com/api/livestream-redirect/BLUE_FM_100_7AAC.aac",
      name: "Blue FM",
      img: "../../../public/logosRadios/radiobluelogo1.png"
    },
    La100: {
      url: "http://playerservices.streamtheworld.com/api/livestream-redirect/FM999_56AAC.aac",
      name: "La 100",
      img: "../../../public/logosRadios/la100logo1.png"
    },
  };

  const handleRadioClick = (radio) => {
    setSelectedRadio(radio); 
  };

  return (
    <div> 
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

      <Box>
        <Typography variant='h4'>Elegi la radio</Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {Object.keys(EmisorasTemp).map((emisoraKey) => (
          <Grid item key={emisoraKey}>
            <Button
              variant="contained"
              sx={{ width: 100, height: 50 }}
              onClick={() => handleRadioClick(EmisorasTemp[emisoraKey])}
            >
              {EmisorasTemp[emisoraKey].name.substring(0, 3)}
            </Button>
          </Grid>
        ))}
      </Grid>

      <RadioPlayer
        url={selectedRadio.url}
        name={selectedRadio.name}
      />
    </div>
  );
};
export default Radios;
