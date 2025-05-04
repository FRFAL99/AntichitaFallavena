import React, { useState, useEffect } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';
import Card from './Card';
import './CSScomponents/Bacheca.css';

const Bacheca = () => {
  const [arrayBacheca, setBachecaArray] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // Funzione per ottenere i dati dal database
  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const dbRef = ref(db, 'Bacheca');
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const dataWithIds = [];
        
        // Itera attraverso ogni elemento e aggiungi l'id
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const data = childSnapshot.val();
          dataWithIds.push({
            ...data,
            id: key // Memorizza l'ID Firebase come proprietà 'id'
          });
        });
        
        // Standardizza i nomi dei campi per gestire maiuscole/minuscole
        const normalizedData = dataWithIds.map(item => {
          // Crea un nuovo oggetto con i campi normalizzati
          const normalizedItem = {
            id: item.id // Preserva l'ID
          };
          
          // Cicla attraverso tutte le proprietà dell'oggetto
          Object.keys(item).forEach(key => {
            // Converti le chiavi in lowercase per la ricerca
            const lowerKey = key.toLowerCase();
            
            // Mappa le chiavi specifiche che ci interessano
            if (lowerKey === 'categoria' || lowerKey === 'categoría') {
              normalizedItem.categoria = item[key];
            } else if (lowerKey === 'nome') {
              normalizedItem.nome = item[key];
            } else if (lowerKey === 'descrizione') {
              normalizedItem.descrizione = item[key];
            } else if (lowerKey === 'immagineurl') {
              normalizedItem.immagineUrl = item[key];
            } else if (lowerKey === 'prezzo') {
              normalizedItem.prezzo = item[key];
            } else if (key !== 'id') { // Non duplicare l'ID
              // Mantieni le altre proprietà così come sono
              normalizedItem[key] = item[key];
            }
          });
          
          return normalizedItem;
        });
        
        console.log("Dati normalizzati con ID:", normalizedData);
        
        setBachecaArray(normalizedData);
        setFilteredItems(normalizedData);
        
        // Estrai categorie uniche (verifica se il campo esiste)
        const uniqueCategories = [...new Set(normalizedData
          .filter(item => item.categoria) // Filtra solo gli elementi con categoria definita
          .map(item => item.categoria))];
        setCategories(uniqueCategories);
        
        console.log("Categorie trovate:", uniqueCategories);
      } else {
        console.error('Nessun dato trovato.');
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dati:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effetto per chiamare fetchData una sola volta quando il componente viene montato
  useEffect(() => {
    fetchData();
  }, []);

  // Effetto per filtrare gli elementi in base alle selezioni dell'utente
  useEffect(() => {
    let result = [...arrayBacheca];
    
    // Applica filtro per categoria
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.categoria === selectedCategory);
    }
    
    // Applica filtro per ricerca testuale
    // if (searchTerm) {
    //   const term = searchTerm.toLowerCase();
    //   result = result.filter(item => 
    //     (item.nome?.toLowerCase().includes(term) || false) || 
    //     (item.descrizione?.toLowerCase().includes(term) || false)
    //   );
    // }
    
    // Applica ordinamento
    switch(sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          // Gestisci diversi formati del prezzo
          const priceA = typeof a.prezzo === 'string' 
            ? parseFloat(a.prezzo.replace(/[^0-9.,]/g, '').replace(',', '.')) 
            : parseFloat(a.prezzo || 0);
          const priceB = typeof b.prezzo === 'string'
            ? parseFloat(b.prezzo.replace(/[^0-9.,]/g, '').replace(',', '.'))
            : parseFloat(b.prezzo || 0);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = typeof a.prezzo === 'string' 
            ? parseFloat(a.prezzo.replace(/[^0-9.,]/g, '').replace(',', '.')) 
            : parseFloat(a.prezzo || 0);
          const priceB = typeof b.prezzo === 'string'
            ? parseFloat(b.prezzo.replace(/[^0-9.,]/g, '').replace(',', '.'))
            : parseFloat(b.prezzo || 0);
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        result.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''));
        break;
      default:
        // Mantieni l'ordine originale
        break;
    }
    
    setFilteredItems(result);
  }, [arrayBacheca, selectedCategory, sortBy]);

  // Carica più elementi
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 8);
  };

  return (
    <section className="bacheca-section py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="section-header">
          <h2 className="bacheca-title">In Evidenza</h2>
          <p className="section-subtitle">Esplora la nostra selezione di oggetti unici</p>
        </div>

        {/* Barra di filtri e ricerca */}
        {/* <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
          </div>
          
          <div className="filter-options">
            {categories.length > 0 && (
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tutte le categorie</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            )}
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Ordinamento predefinito</option>
              <option value="price-asc">Prezzo: dal più basso</option>
              <option value="price-desc">Prezzo: dal più alto</option>
              <option value="name-asc">Nome: A-Z</option>
              <option value="name-desc">Nome: Z-A</option>
            </select>
          </div>
        </div> */}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Caricamento in corso...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="row gx-4 gx-lg-5 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
              {filteredItems.slice(0, visibleCount).map((annuncio, index) => (
                <div className="col mb-5 card-animation" key={index}>
                  <Card
                    nome={annuncio.nome}
                    foto={annuncio.immagineUrl}
                    descrizione={annuncio.descrizione}
                    prezzo={annuncio.prezzo}
                    categoria={annuncio.categoria}
                    id={annuncio.id} // Passiamo l'ID alla Card
                  />
                </div>
              ))}
            </div>
            
            {visibleCount < filteredItems.length && (
              <div className="text-center mt-4">
                <button className="load-more-btn" onClick={loadMore}>
                  Mostra altri
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <p>Nessun risultato trovato. Prova a modificare i filtri.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Bacheca;