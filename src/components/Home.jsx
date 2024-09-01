import React from 'react';
import { Container, Grid } from '@mui/material';
import AppCard from '../components/AppCard';
import RadioImg from '../assets/AppCardImgs/radio.png';
import ContadorImg from '../assets/AppCardImgs/cuentaganado01.webp';
import CumplesImg from '../assets/AppCardImgs/cumples.png';
import ClavesImg from '../assets/AppCardImgs/passwordimg.png';


const Home = () => {
	return (
		<Container className="main-content">
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6} md={4}>
					<AppCard
						title="Contador"
						description="Aplicación de contador"
						path="/contador"
						image={ContadorImg} />
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<AppCard
						title="Cumples"
						description="Calendario de cumpleaños"
						path="/cumples"
						image={CumplesImg} />
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<AppCard
						title="Claves"
						description="Gestor de claves"
						path="/claves"
						image={ClavesImg} />
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<AppCard
						title="Radios"
						description="Radios de todos lados"
						path="/radios"
						image={RadioImg} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Home;
