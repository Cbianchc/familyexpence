import React, { useState, useEffect } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { auth, db } from '../../data/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useFirestore from '../../customHooks/useFirestore';

import './Board.css';
import CustomList from './List';
import ModalCumple from './modal/ModalCumple';

export default function Board() {
  const [userOffices, setUserOffices] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    const fetchUserOffices = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserOffices(userData.offices || []);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserOffices();
  }, []);

  const { data: officeData, loading: loadingOffices, error: officeError } = useFirestore('offices', userOffices);

  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (officeData.length > 0) {
      let allEvents = [];
      for (const office of officeData) {
        if (office.birthdays) {
          const officeBirthdays = Object.entries(office.birthdays).map(([id, data]) => ({
            id,
            name: data.name,
            date: data.date,
            type: 'birthday',
            admin: data.admin,
            description: data.description,
            participants: data.participants,
            officeId: office.id 
          }));
          allEvents = [...allEvents, ...officeBirthdays];
        }

        if (office.events) {
          const officeEvents = office.events.map(event => ({
            ...event,
            type: 'event',
            officeId: office.id
          }));
          allEvents = [...allEvents, ...officeEvents];
        }
      }
      const validEvents = allEvents.filter(event => event.date);
      // console.log("Events in Board with officeId:", validEvents);

      setEvents(validEvents);
    }
  }, [officeData]);

  if (loadingUser || loadingOffices) return <div>Cargando...</div>;
  if (officeError) return <div>Error cargando datos de las oficinas: {officeError.message}</div>;

  const thisMonthEvents = filterThisMonth(events);
  const nextMonthEvents = filterNextMonth(events);
  
  // console.log("Events for this month before passing to CustomList:", thisMonthEvents);
  // console.log("Events for next month before passing to CustomList:", nextMonthEvents);
  
  return (
    <main id='site-main'>
      <h1 variant="h4" className="title">
        <ModalCumple />
      </h1>
      <div className="board">
        <h3 className='upcoming text-dark'>Este mes:</h3>
        <CustomList info={thisMonthEvents}></CustomList>
        <h3 className='upcoming text-dark'>Próximo mes:</h3>
        <CustomList info={nextMonthEvents} upcoming={true}></CustomList>
      </div>
    </main>
  );


  // return (
  //   <main id='site-main'>
  //     <h1 variant="h4" className="title">
  //       <ModalCumple />
  //     </h1>
  //     <div className="board">
  //       <h3 className='upcoming text-dark'>Este mes:</h3>
  //       <CustomList info={filterThisMonth(events)} officeId={events[0]?.officeId}></CustomList>
  //       <h3 className='upcoming text-dark'>Próximo mes:</h3>
  //       <CustomList info={filterNextMonth(events)} upcoming={true} officeId={events[0]?.officeId}></CustomList>
  //     </div>
  //   </main>
  // );
}

const filterThisMonth = (events) => {
  const now = new Date();
  const filteredEvents = events.filter(event =>
    isWithinInterval(parseISO(event.date), { start: now, end: new Date(now.getFullYear(), now.getMonth() + 1, 0) })
  );
  // console.log("Filtered events for this month:", filteredEvents);
  return filteredEvents;
};

const filterNextMonth = (events) => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const filteredEvents = events.filter(event =>
    isWithinInterval(parseISO(event.date), { start: nextMonth, end: new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0) })
  );
  // console.log("Filtered events for next month:", filteredEvents);
  return filteredEvents;
};

