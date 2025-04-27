import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import app from '../firebase-config';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import './CSSpages/Eventi.css';

const Eventi = () => {
  const [activeTab, setActiveTab] = useState('ongoing'); // 'upcoming', 'ongoing', o 'past'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventiInProgramma, setEventiInProgramma] = useState([]);
  const [eventiInCorso, setEventiInCorso] = useState([]);
  const [eventiPassati, setEventiPassati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stati per la newsletter
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState(false);

  useEffect(() => {
    const fetchEventi = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, 'eventi');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const dataEventi = [];
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per un confronto accurato
          const todayTimestamp = today.getTime();

          // Itera attraverso ogni elemento e aggiungi l'id
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const data = childSnapshot.val();
            
            // Filtra solo gli eventi con status "pubblicato"
            if (data.status === 'pubblicato') {
              dataEventi.push({
                ...data,
                id: key
              });
            }
          });

          // Separa eventi in categorie
          const eventiInProgrammaData = dataEventi.filter(evento => 
            evento.dataInizioTimestamp > todayTimestamp);
          
          const eventiInCorsoData = dataEventi.filter(evento => 
            evento.dataInizioTimestamp <= todayTimestamp && 
            evento.dataFineTimestamp >= todayTimestamp);
          
          const eventiPassatiData = dataEventi.filter(evento => 
            evento.dataFineTimestamp < todayTimestamp);

          // Ordina gli eventi
          eventiInProgrammaData.sort((a, b) => a.dataInizioTimestamp - b.dataInizioTimestamp);
          eventiInCorsoData.sort((a, b) => a.dataInizioTimestamp - b.dataInizioTimestamp);
          eventiPassatiData.sort((a, b) => b.dataFineTimestamp - a.dataFineTimestamp);

          setEventiInProgramma(eventiInProgrammaData);
          setEventiInCorso(eventiInCorsoData);
          setEventiPassati(eventiPassatiData);
        } else {
          setEventiInProgramma([]);
          setEventiInCorso([]);
          setEventiPassati([]);
        }
      } catch (err) {
        console.error("Errore nel recupero degli eventi:", err);
        setError("Si è verificato un errore nel caricamento degli eventi.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventi();
  }, []);

  // Funzione per gestire la sottoscrizione alla newsletter
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMessage('');
    setNewsletterError(false);

    try {
      const db = getDatabase(app);
      const newsletterRef = ref(db, 'newsletter_subscribers');
      
      // Verifica se l'email è già registrata
      const snapshot = await get(newsletterRef);
      let emailExists = false;
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().email === email) {
            emailExists = true;
          }
        });
      }
      
      if (emailExists) {
        setNewsletterMessage('Questa email è già registrata alla newsletter.');
        setNewsletterError(true);
      } else {
        // Aggiungi l'email al database
        const newSubscriberRef = push(newsletterRef);
        await set(newSubscriberRef, {
          email: email,
          subscribedAt: Date.now(),
          active: true
        });
        
        setNewsletterMessage('Grazie per esserti iscritto alla nostra newsletter!');
        setEmail(''); // Pulisci il campo email
      }
    } catch (error) {
      console.error('Errore durante l\'iscrizione alla newsletter:', error);
      setNewsletterMessage('Si è verificato un errore. Riprova più tardi.');
      setNewsletterError(true);
    } finally {
      setNewsletterLoading(false);
      
      // Rimuovi il messaggio dopo 5 secondi
      setTimeout(() => {
        setNewsletterMessage('');
        setNewsletterError(false);
      }, 5000);
    }
  };

  // Funzione per convertire timestamp in data leggibile
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Funzione per formattare il periodo
  const formatPeriod = (startTimestamp, endTimestamp) => {
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    
    // Se è lo stesso giorno
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startTimestamp);
    }
    
    // Se stesso mese e anno
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `Dal ${start.getDate()} al ${end.getDate()} ${start.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
    }
    
    // Altrimenti mostra entrambe le date complete
    return `Dal ${formatDate(startTimestamp)} al ${formatDate(endTimestamp)}`;
  };

  if (loading) {
    return (
      <div className="eventi-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventi-page">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const renderEventCard = (evento) => (
    <div key={evento.id} className="evento-card">
      {evento.imageUrls && evento.imageUrls.length > 0 && (
        <div className="evento-image">
          <img src={evento.imageUrls[0]} alt={evento.titolo} />
        </div>
      )}
      <div className="evento-content">
        <h3>{evento.titolo}</h3>
        <div className="evento-info">
          <p><i className="bi bi-calendar3"></i> {formatPeriod(evento.dataInizioTimestamp, evento.dataFineTimestamp)}</p>
          <p><i className="bi bi-geo-alt"></i> {evento.luogo}</p>
        </div>
        {evento.imageUrls && evento.imageUrls.length > 1 && (
          <button 
            className="btn-galleria"
            onClick={() => setSelectedEvent(evento)}
          >
            <i className="bi bi-images"></i> Vedi tutte le foto ({evento.imageUrls.length})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="eventi-page">
      {/* Hero Section */}
      <section className="eventi-hero">
        <div className="container">
          <h1>Eventi</h1>
          <p className="lead">
            Scopri i nostri eventi, mostre e workshop dedicati al mondo dell'antiquariato
          </p>
        </div>
      </section>

      {/* Tabs per switchare tra eventi in corso, futuri e passati */}
      <div className="eventi-tabs">
        <div className="container">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              In Corso ({eventiInCorso.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Prossimamente ({eventiInProgramma.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Eventi Passati ({eventiPassati.length})
            </button>
          </div>
        </div>
      </div>

      {/* Eventi in Corso */}
      {activeTab === 'ongoing' && (
        <section className="eventi-section">
          <div className="container">
            {eventiInCorso.length > 0 ? (
              <div className="eventi-grid">
                {eventiInCorso.map(renderEventCard)}
              </div>
            ) : (
              <div className="no-eventi">
                <p>Non ci sono eventi in corso al momento.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Eventi in Programma */}
      {activeTab === 'upcoming' && (
        <section className="eventi-section">
          <div className="container">
            {eventiInProgramma.length > 0 ? (
              <div className="eventi-grid">
                {eventiInProgramma.map(renderEventCard)}
              </div>
            ) : (
              <div className="no-eventi">
                <p>Non ci sono eventi in programma al momento.</p>
                <p>Torna presto per scoprire le prossime iniziative!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Eventi Passati */}
      {activeTab === 'past' && (
        <section className="eventi-section">
          <div className="container">
            {eventiPassati.length > 0 ? (
              <div className="eventi-grid">
                {eventiPassati.map(evento => (
                  <div key={evento.id} className="evento-card past">
                    {evento.imageUrls && evento.imageUrls.length > 0 && (
                      <div className="evento-image">
                        <img src={evento.imageUrls[0]} alt={evento.titolo} />
                      </div>
                    )}
                    <div className="evento-content">
                      <h3>{evento.titolo}</h3>
                      <div className="evento-info">
                        <p><i className="bi bi-calendar3"></i> {formatPeriod(evento.dataInizioTimestamp, evento.dataFineTimestamp)}</p>
                        <p><i className="bi bi-geo-alt"></i> {evento.luogo}</p>
                      </div>
                      {evento.imageUrls && evento.imageUrls.length > 0 && (
                        <button 
                          className="btn-galleria"
                          onClick={() => setSelectedEvent(evento)}
                        >
                          <i className="bi bi-images"></i> Vedi galleria foto
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-eventi">
                <p>Non ci sono eventi passati da mostrare.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal Galleria Fotografica */}
      {selectedEvent && selectedEvent.imageUrls && (
        <div className="gallery-modal" onClick={() => setSelectedEvent(null)}>
          <div className="gallery-content" onClick={e => e.stopPropagation()}>
            <button className="close-gallery" onClick={() => setSelectedEvent(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <h3>{selectedEvent.titolo}</h3>
            <div className="gallery-grid">
              {selectedEvent.imageUrls.map((imgUrl, index) => (
                <div key={index} className="gallery-image">
                  <img src={imgUrl} alt={`${selectedEvent.titolo} - Foto ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Resta aggiornato sui nostri eventi</h2>
            <p>Iscriviti alla newsletter per ricevere informazioni sugli eventi in programma</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Inserisci la tua email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="btn-newsletter" disabled={newsletterLoading}>
                {newsletterLoading ? 'Iscrizione in corso...' : 'Iscriviti'}
              </button>
            </form>
            {newsletterMessage && (
              <p className={`newsletter-message ${newsletterError ? 'error' : 'success'}`}>
                {newsletterMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Eventi;