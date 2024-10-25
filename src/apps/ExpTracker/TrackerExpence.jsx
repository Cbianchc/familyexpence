import React, { useState, useEffect } from 'react';
import { auth, db } from '../../data/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

import { Container, Box } from '@mui/material';

import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';

import { GlobalProvider } from './context/GlobalState';

function TrackerExpence() {
  const [loading, setLoading] = useState(true);
  const [familyId, setFamilyId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoading(false);
    } else {
      console.log("User not logged in");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchFamilyId = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Acceder al documento del usuario en la colección `familiasusers`
          const userDocRef = doc(db, 'familiasusers', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.familyId) {
              setFamilyId(userData.familyId); // Guardar el familyId en el estado
              // console.log('Family ID fetched:', userData.familyId);
              setUserName(userData)
              // console.log("Aca ta ", userName.username)
            } else {
              console.error('Family ID not found in user document');
            }
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching family ID:', error);
        }
      } else {
        console.error('User not authenticated');
      }
    };

    fetchFamilyId();
  }, []);


  return (
    <GlobalProvider>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container maxWidth="sm" sx={{ mt: 5, p: 0 }}>
          <Box my={1}>
            <Balance />
            <AddTransaction familyId={familyId} user={userName}/>
            <IncomeExpenses user={userName}/>
            <TransactionList />
          </Box>
        </Container>
      )}
    </GlobalProvider>
  );
}

export default TrackerExpence;
