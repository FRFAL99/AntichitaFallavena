import React, { useState, useEffect } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database'; // Usa firebase/database per il Realtime Database
import Card from './Card';

const Bacheca = () => {
  const [arrayBacheca, setBachecaArray] = useState([]); // Stato per i dati della bacheca
  const [isLoading, setIsLoading] = useState(true); // Stato per gestire il caricamento

  // Funzione per ottenere i dati dal database
  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const dbRef = ref(db, 'Bacheca'); // Percorso nel database
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setBachecaArray(Object.values(snapshot.val())); // Popola l'array con i valori
      } else {
        console.error('Nessun dato trovato.');
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dati:', error);
    } finally {
      setIsLoading(false); // Caricamento completato
    }
  };

  // Effetto per chiamare fetchData una sola volta quando il componente viene montato
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="bacheca-section py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <h2 className="bacheca-title mb-4">In Evidenza:</h2>
        {isLoading ? (
          <p>Caricamento in corso...</p>
        ) : (
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {arrayBacheca.map((annuncio, index) => (
              <Card
                key={index}
                nome={annuncio.nome}
                foto={annuncio.immagineUrl}
                descrizione={annuncio.descrizione}
                prezzo={annuncio.prezzo}
                link="#"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bacheca;

