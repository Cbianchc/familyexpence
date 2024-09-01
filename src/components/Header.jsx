import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../apps/contexts/authContext';

import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { AccountCircle } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';

import '../App.css';

const Header = ({ handleLogout }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);


	const renderGreeting = () => {
		if (loading) return 'Cargando...';
		if (user && user.username) return (
			<span className="greeting">
				HOLA <span className="gradient-name">{user.username}</span>!
			</span>
		);
		return '¡Bienvenido! Por favor carga tus datos en tu perfil 👉';
	};

  const handleProfileClick = () => {
    if (isProfileOpen) {
      navigate('/'); // Vuelve a la página anterior
    } else {
      navigate('/profile'); //O abre el profile
    }
    setIsProfileOpen(!isProfileOpen);
  };
	// revisar si esta en Home u otro lado...
	const isHomePage = location.pathname === '/';

	return (
		<AppBar className="header" position="static" >
			<Toolbar>
				{/* COndicional para que aparezca el icono home */}
				{!isHomePage && (
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
				)}
				<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
					<Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontSize: { xs: '1rem', sm: '1.5rem' } }}>
						{renderGreeting()}
					</Typography>
					<IconButton color="inherit" onClick={handleProfileClick}>
						<AccountCircle />
					</IconButton>
					<IconButton color="inherit" onClick={handleLogout}>
						<Logout />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
