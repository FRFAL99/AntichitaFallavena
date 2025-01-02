import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';

const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'prodotti'));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(products);
  } catch (error) {
    console.error('Errore durante il recupero dei prodotti:', error);
  }
};

fetchProducts();
