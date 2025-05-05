import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';
import './CSSpages/AdminEventi.css'; // Riutilizziamo gli stili esistenti

const AdminDashboard = () => {
  const { logout } = useGoogleAuth();
  const navigate = useNavigate();
  
  // Stati per le statistiche
  const [eventiCount, setEventiCount] = useState('-');
  const [catalogoCount, setCatalogoCount] = useState('-');
  const [bachecaCount, setBachecaCount] = useState('-');
  const [loading, setLoading] = useState(true);

  // Carica i dati all'avvio
  useEffect(() => {
    fetchStatistiche();
  }, []);

  const fetchStatistiche = async () => {
    setLoading(true);
    try {
      const db = getDatabase(app);
      
      // Recupera i conteggi dalle diverse collezioni
      const eventiRef = ref(db, 'Eventi');
      const catalogoRef = ref(db, 'Catalogo');
      const bachecaRef = ref(db, 'Bacheca');
      
      const [eventiSnapshot, catalogoSnapshot, bachecaSnapshot] = await Promise.all([
        get(eventiRef),
        get(catalogoRef),
        get(bachecaRef)
      ]);
      
      // Calcola i conteggi
      let eventiNum = 0;
      let catalogoNum = 0;
      let bachecaNum = 0;
      
      if (eventiSnapshot.exists()) {
        eventiSnapshot.forEach(() => {
          eventiNum++;
        });
      }
      
      if (catalogoSnapshot.exists()) {
        catalogoSnapshot.forEach(() => {
          catalogoNum++;
        });
      }
      
      if (bachecaSnapshot.exists()) {
        bachecaSnapshot.forEach(() => {
          bachecaNum++;
        });
      }
      
      // Aggiorna gli stati
      setEventiCount(eventiNum);
      setCatalogoCount(catalogoNum);
      setBachecaCount(bachecaNum);
    } catch (error) {
      console.error("Errore nel recupero delle statistiche:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-eventi">
      <div className="admin-header">
        <h1>Dashboard Amministrazione</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
        padding: '0 1rem'
      }}>
        {/* Card per gestione Eventi */}
        <div 
          className="dashboard-card"
          onClick={() => navigateTo('/admin/eventi')}
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#EB5E28';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#EB5E28',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h2 style={{ color: '#403D39', marginBottom: '1rem' }}>Gestione Eventi</h2>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            Crea, modifica ed elimina gli eventi del sito. Gestisci date, immagini e dettagli degli eventi.
          </p>
          <button style={{
            backgroundColor: '#EB5E28',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}>
            Accedi alla gestione
          </button>
        </div>

        {/* Card per gestione Prodotti */}
        <div 
          className="dashboard-card"
          onClick={() => navigateTo('/admin/prodotti')}
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#EB5E28';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#EB5E28',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2 style={{ color: '#403D39', marginBottom: '1rem' }}>Gestione Prodotti</h2>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            Amministra il catalogo prodotti e la bacheca. Aggiungi, modifica e organizza i tuoi articoli.
          </p>
          <button style={{
            backgroundColor: '#EB5E28',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}>
            Accedi alla gestione
          </button>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div style={{
        marginTop: '4rem',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#403D39', marginBottom: '1.5rem' }}>Statistiche Rapide</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid rgba(235, 94, 40, 0.3)',
              borderRadius: '50%',
              borderTop: '4px solid #EB5E28',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p style={{ marginTop: '1rem', color: '#6c757d' }}>Caricamento statistiche...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Eventi Attivi</h4>
              <p style={{ fontSize: '2rem', color: '#EB5E28', margin: 0 }}>{eventiCount}</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Prodotti in Catalogo</h4>
              <p style={{ fontSize: '2rem', color: '#EB5E28', margin: 0 }}>{catalogoCount}</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Prodotti in Bacheca</h4>
              <p style={{ fontSize: '2rem', color: '#EB5E28', margin: 0 }}>{bachecaCount}</p>
            </div>
          </div>
        )}
        <div style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          justifyContent: 'center',
          opacity: loading ? 0.5 : 1
        }}>
          <button 
            onClick={fetchStatistiche}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid #EB5E28',
              color: '#EB5E28',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'rgba(235, 94, 40, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Aggiorna statistiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;