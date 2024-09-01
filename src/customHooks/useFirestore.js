import { useState, useEffect } from 'react';
import { db } from '../data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useFirestore = (collection, docIds) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await Promise.all(
          docIds.map(async (docId) => {
            const docRef = doc(db, collection, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id: docId, ...docSnap.data() };
            }
            return null;
          })
        );
        setData(fetchedData.filter(item => item !== null));
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (docIds && docIds.length > 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [collection, docIds]);

  const updateData = async (docId, newData) => {
    try {
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, newData);
      setData(prevData => {
        const updatedData = prevData.map(item => (item.id === docId ? { ...item, ...newData } : item));
        return updatedData;
      });
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err);
    }
  };

  return { data, loading, error, updateData };
};

export default useFirestore;


