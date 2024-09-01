import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './apps/contexts/authContext';
import { auth } from "./data/firebase";
import { signOut } from "firebase/auth";

import Signin from './apps/Signin/Signin';
import Login from './apps/Login/Login';

import Dashboard from './components/Dashboard';
import JoinFamily from './apps/JoinOffice/JoinFamily';
import UserProfile from './apps/Profile/UserProfile';

import './App.css';
import { GlobalProvider } from './apps/ExpTracker/context/GlobalState';

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  //esto es para que header no aparezca en join-office, solo por que queda feo
  const shouldShowHeader = !['/join-family', '/signin', '/login'].includes(location.pathname);


  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <Signin />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/join-family" element={user ? <JoinFamily /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
