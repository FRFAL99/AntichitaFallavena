// setupWhitelist.js - Script per configurare la whitelist

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Copia la configurazione Firebase dal tuo file firebase-config
const firebaseConfig = {
  apiKey: "AIzaSyBnIL7_zW9iSwCXya58N0GvyCHFNI5Hh50",
  authDomain: "antichita-fallavena.firebaseapp.com",
  databaseURL: "https://antichita-fallavena-default-rtdb.europe-west1.firebasedatabase.app/", 
  projectId: "antichita-fallavena",
  storageBucket: "antichita-fallavena.firebasestorage.app",
  messagingSenderId: "586728921768",
  appId: "1:586728921768:web:c707b0f22f114b3bea009d"
};


// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const setupWhitelist = async () => {
  // Definisci la whitelist come oggetto con email come chiavi
  // I punti nelle email vengono sostituiti con virgole per compatibilità con Firebase
  const whitelist = {
    'francesco,fallavena@gmail,com': true,
    'admin@antichitafallavena,it': true,
  };

  try {
    // Salva la whitelist nel database
    const whitelistRef = ref(db, 'admin_whitelist');
    await set(whitelistRef, whitelist);
    
    console.log('Whitelist configurata con successo!');
    console.log('Email autorizzate:', Object.keys(whitelist).map(email => email.replace(/,/g, '.')));
  } catch (error) {
    console.error('Errore nella configurazione della whitelist:', error);
  }
};

// Esegui lo script
setupWhitelist();