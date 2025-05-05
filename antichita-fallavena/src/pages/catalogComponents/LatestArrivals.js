// src/components/catalogComponents/LatestArrivals.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import app from '../../firebase-config';
import { getDatabase, ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import './CssCatalog/LatestArrivals.css';

const LatestArrivals = () => {
  const [latestItems, setLatestItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Funzione per recuperare gli ultimi elementi aggiunti
  const fetchLatestItems = async () => {
    try {
      const db = getDatabase(app);
      const catalogoRef = ref(db, 'Catalogo');
      
      // Creiamo una query per ottenere gli ultimi 3 elementi aggiunti
      const latestItemsQuery = query(
        catalogoRef,
        orderByChild('dataAggiunta'),
        limitToLast(3)
      );
      
      const snapshot = await get(latestItemsQuery);
      
      if (snapshot.exists()) {
        const items = [];
        
        // Itera attraverso ogni elemento e aggiungi l'id
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const data = childSnapshot.val();
          items.push({
            ...data,
            id: key
          });
        });
        
        // Inverti l'array per avere i più recenti prima
        setLatestItems(items.reverse());
      } else {
        console.log('Nessun dato trovato per gli ultimi arrivi.');
      }
    } catch (error) {
      console.error('Errore durante il recupero degli ultimi arrivi:', error);
      setError('Si è verificato un errore nel caricamento degli ultimi arrivi');
    } finally {
      setIsLoading(false);
    }
  };

  // Effetto per chiamare fetchLatestItems una sola volta quando il componente viene montato
  useEffect(() => {
    fetchLatestItems();
  }, []);
  
  // Rotazione automatica degli articoli ogni 5 secondi
  useEffect(() => {
    if (latestItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % latestItems.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [latestItems]);

  // Se ci sono errori o nessun dato, non mostrare nulla
  if (error || latestItems.length === 0) {
    return null;
  }

  // Durante il caricamento, mostra un placeholder minimo
  if (isLoading) {
    return (
      <div className="latest-arrivals-ribbon">
        <div className="ribbon-loading">
          <div className="ribbon-spinner"></div>
        </div>
      </div>
    );
  }
  
  // Gestisci il cambio manuale di articolo
  const goToItem = (index) => {
    setCurrentIndex(index);
  };
  
  // Formatazione del prezzo
  const formatPrice = (product) => {
    if (product.prezzoNonSpecificato) {
      return 'Prezzo non specificato';
    }
    if (!product.prezzo) {
      return 'Prezzo su richiesta';
    }
    
    if (typeof product.prezzo === 'string' && product.prezzo.includes('€')) {
      return product.prezzo;
    }
    
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(product.prezzo);
  };

  // Item corrente
  const currentItem = latestItems[currentIndex];

  return (
    <div className="latest-arrivals-ribbon">
      <div className="ribbon-header">
        <div className="ribbon-title">
          <span className="ribbon-icon">✦</span>
          <h3>Ultimi arrivi</h3>
          <span className="ribbon-icon">✦</span>
        </div>
        <div className="ribbon-nav">
          {latestItems.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToItem(index)}
              aria-label={`Vai all'articolo ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="ribbon-content">
        <div className="ribbon-image">
          <img 
            src={currentItem.immagineUrl} 
            alt={currentItem.nome || 'Prodotto'} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400?text=Immagine+non+disponibile';
            }}
          />
          <div className="ribbon-badge">Novità</div>
        </div>
        
        <div className="ribbon-details">
          <div className="ribbon-categories">
            {currentItem.categoria && (
              <span className="ribbon-category">{currentItem.categoria}</span>
            )}
            {currentItem.epoca && (
              <span className="ribbon-epoch">{currentItem.epoca}</span>
            )}
          </div>
          
          <h4 className="ribbon-name">{currentItem.nome || 'Prodotto senza nome'}</h4>
          
          <p className="ribbon-description">
            {currentItem.descrizione ? 
              (currentItem.descrizione.length > 120 ? 
                `${currentItem.descrizione.substring(0, 120)}...` : 
                currentItem.descrizione
              ) : 
              'Nessuna descrizione disponibile'
            }
          </p>
          
          <div className="ribbon-price">{formatPrice(currentItem)}</div>
          
          <Link to={`/prodotto/${currentItem.id}`} className="ribbon-button">
            Scopri di più
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestArrivals;