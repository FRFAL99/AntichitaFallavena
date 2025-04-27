import React, { createContext, useState, useContext, useEffect } from 'react';
import app from '../firebase-config';
import { getAuth, signInWithPopup, GoogleAuthProvider as GoogleProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const GoogleAuthContext = createContext();

export function useGoogleAuth() {
  return useContext(GoogleAuthContext);
}

export function GoogleAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const auth = getAuth(app);
  const googleProvider = new GoogleProvider();
  const db = getDatabase(app);

  const checkAuthorization = async (email) => {
    try {
      const whitelistRef = ref(db, 'admin_whitelist');
      const snapshot = await get(whitelistRef);
      
      if (snapshot.exists()) {
        const whitelist = snapshot.val();
        
        // Se la whitelist è un array
        if (Array.isArray(whitelist)) {
          return whitelist.includes(email);
        } 
        // Se la whitelist è un oggetto (chiave-valore)
        else if (typeof whitelist === 'object') {
          // Sostituisci i punti con virgole per controllare la chiave
          const emailKey = email.replace(/\./g, ',');
          return whitelist.hasOwnProperty(emailKey);
        }
      }
      return false;
    } catch (error) {
      console.error("Errore nel controllo whitelist:", error);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isUserAuthorized = await checkAuthorization(result.user.email);
      
      if (!isUserAuthorized) {
        // Se l'email non è autorizzata, disconnetti immediatamente
        await signOut(auth);
        throw new Error("Email non autorizzata per l'accesso all'admin");
      }
      
      setIsAuthorized(true);
      return result.user;
    } catch (error) {
      setIsAuthorized(false);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthorized(false);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isUserAuthorized = await checkAuthorization(user.email);
        setIsAuthorized(isUserAuthorized);
        if (isUserAuthorized) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          // Se l'utente non è autorizzato, disconnettilo
          await signOut(auth);
        }
      } else {
        setCurrentUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    isAuthorized
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {!loading && children}
    </GoogleAuthContext.Provider>
  );
}