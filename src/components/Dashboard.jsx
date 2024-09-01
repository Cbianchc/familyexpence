import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import LeaderboardIcon from '@mui/icons-material/Leaderboard';
// import PeopleIcon from '@mui/icons-material/People';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './DashboardComponents/listItems';
import { Logout, Brightness4, Brightness7 } from '@mui/icons-material';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalculateIcon from '@mui/icons-material/Calculate';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'; import LayersIcon from '@mui/icons-material/Layers';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { AccountCircle } from '@mui/icons-material';

import DividirGastos from '../apps/DivideCuenta/DividirGastos';
import TrackerExpence from '../apps/ExpTracker/TrackerExpence';
import ListaCompras from '../apps/Compras/ListaCompras';
import ConversorDivisas from '../apps/Conversor/ConversorDivisas';
import UserProfile from '../apps/Profile/UserProfile'

import { AuthProvider, useAuth } from '../apps/contexts/authContext';
import { auth } from "../data/firebase";
import { signOut } from "firebase/auth";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [openTracker, setOpenTraker] = React.useState(true);
  const [openCompras, setOpenCompras] = React.useState(false);
  const [openDivideGastos, setOpenDivideGastos] = React.useState(false);
  const [openPerfil, setOpenPerfil] = React.useState(false);
  const [openConversor, setOpenConversor] = React.useState(false);
  const { user, loading } = useAuth();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };
  const HandleTrackerExp = () => {
    setOpenTraker(true);
    setOpenCompras(false);
    setOpenDivideGastos(false);
    setOpenPerfil(false);
    setOpenConversor(false);
  }

  const HandleCompras = () => {
    setOpenTraker(false);
    setOpenCompras(true);
    setOpenDivideGastos(false);
    setOpenPerfil(false);
    setOpenConversor(false);
  }

  const HandleDivideCuenta = () => {
    setOpenTraker(false);
    setOpenCompras(false);
    setOpenDivideGastos(true);
    setOpenPerfil(false);
    setOpenConversor(false);
  }

  const HandlePerfil = () => {
    setOpenTraker(false);
    setOpenCompras(false);
    setOpenDivideGastos(false);
    setOpenPerfil(true);
    setOpenConversor(false);
  }

  const HandleConversor = () => {
    setOpenTraker(false);
    setOpenCompras(false);
    setOpenDivideGastos(false);
    setOpenPerfil(false);
    setOpenConversor(true)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Perfil header
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" sx={{ flexGrow: 1 }}>
            {/* Pestaña perfil */}
            <ListItemButton onClick={HandleTrackerExp}>
              <ListItemIcon>
                <LeaderboardIcon />
              </ListItemIcon>
              <ListItemText primary="Gastos" />
            </ListItemButton>
            {/* pestaña Compras             */}
            <ListItemButton onClick={HandleCompras}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Compras" />
            </ListItemButton>
            {/* Pestaña Dividir la cuenta             */}
            <ListItemButton onClick={HandleDivideCuenta}>
              <ListItemIcon>
                <CalculateIcon />
              </ListItemIcon>
              <ListItemText primary="Dividir Cuenta" />
            </ListItemButton>

            {/* Pestaña Conversor de divisas */}
            <ListItemButton onClick={HandleConversor}>
              <ListItemIcon>
                <CurrencyExchangeIcon />
              </ListItemIcon>
              <ListItemText primary="Divisas" />
            </ListItemButton>


            {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
          </List>
          <Divider sx={{ my: 1 }} />

          {/* Perfil usuario */}
          <Box sx={{ pb: 2 }}>
            <ListItemButton onClick={HandlePerfil}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Usuario" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            {openTracker && <TrackerExpence />}
            {openCompras && <ListaCompras />}
            {openDivideGastos && <DividirGastos />}
            {openPerfil && <UserProfile />}
            {openConversor && <ConversorDivisas />}

          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}