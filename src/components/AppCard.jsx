// src/components/AppCard.jsx
import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppCard = ({ title, description, path, image }) => {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(path);
	};

	return (
		<Card
			sx={{
				position: 'relative',
        maxWidth: 345,
        margin: 2,
        borderRadius: '16px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '&:hover .background': {
          transform: 'scale(1.1)',
        },
			}}
		>
			<Box
        className="background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6,
          transition: 'transform 0.5s ease',
        }}
      />
      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
        }}
      >
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
				<Button size="small" onClick={handleNavigate}>ABRIR</Button>
			</CardActions>
		</Card>
	);
};

export default AppCard;
