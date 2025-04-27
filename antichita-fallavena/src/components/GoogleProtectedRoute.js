import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import '../components/CSScomponents/GoogleAuth.css';

const GoogleProtectedRoute = ({ children }) => {
  const { currentUser, isAuthorized, signInWithGoogle } = useGoogleAuth();

  // Se non c'è utente loggato, mostra un pulsante per login con Google
  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Accesso richiesto</h2>
        <p>Devi accedere con il tuo account Google per visualizzare questa pagina.</p>
        <button onClick={signInWithGoogle} className="btn-google-login">
          Accedi con Google
        </button>
      </div>
    );
  }

  // Se l'utente è loggato ma non autorizzato
  if (!isAuthorized) {
    return (
      <div className="unauthorized">
        <h2>Accesso non autorizzato</h2>
        <p>L'email {currentUser.email} non è autorizzata ad accedere all'area admin.</p>
        <p>Contatta l'amministratore se ritieni sia un errore.</p>
      </div>
    );
  }

  // Se l'utente è loggato e autorizzato
  return children;
};

export default GoogleProtectedRoute;