import React, { useState, useEffect } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';
import Card from '../components/Card';
import './CSSpages/Catalogo.css';

const Catalogo = () => {
  const [arrayCatalogo, setCatalogoArray] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEpoca, setSelectedEpoca] = useState('all');
  const [selectedProvenienza, setSelectedProvenienza] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [epoche, setEpoche] = useState([]);
  const [provenienze, setProvenienze] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [viewMode, setViewMode] = useState('grid'); // Visualizzazione griglia/lista
  const [cardSize, setCardSize] = useState('medium'); // Dimensione card (piccola/media/grande)

  // Funzione per ottenere i dati dal database
  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const dbRef = ref(db, 'Catalogo');
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
            } else if (lowerKey === 'epoca' || lowerKey === 'periodo') {
              normalizedItem.epoca = item[key];
            } else if (lowerKey === 'provenienza') {
              normalizedItem.provenienza = item[key];
            } else if (lowerKey === 'condizione') {
              normalizedItem.condizione = item[key];
            } else if (key !== 'id') { // Non duplicare l'ID
              // Mantieni le altre proprietà così come sono
              normalizedItem[key] = item[key];
            }
          });
          
          // Aggiungi flag per oggetti in evidenza e rari (simulati - in produzione usare dati reali)
          normalizedItem.inEvidenza = Math.random() < 0.2; // 20% casuale
          normalizedItem.isRaro = Math.random() < 0.1; // 10% casuale
          
          return normalizedItem;
        });
        
        console.log("Dati catalogo normalizzati con ID:", normalizedData);
        
        setCatalogoArray(normalizedData);
        setFilteredItems(normalizedData);
        
        // Estrai categorie uniche
        const uniqueCategories = [...new Set(normalizedData
          .filter(item => item.categoria) // Filtra solo gli elementi con categoria definita
          .map(item => item.categoria))];
        setCategories(uniqueCategories);
        
        // Estrai epoche uniche
        const uniqueEpoche = [...new Set(normalizedData
          .filter(item => item.epoca) // Filtra solo gli elementi con epoca definita
          .map(item => item.epoca))];
        setEpoche(uniqueEpoche);
        
        // Estrai provenienze uniche
        const uniqueProvenienze = [...new Set(normalizedData
          .filter(item => item.provenienza) // Filtra solo gli elementi con provenienza definita
          .map(item => item.provenienza))];
        setProvenienze(uniqueProvenienze);
        
        console.log("Categorie trovate:", uniqueCategories);
        console.log("Epoche trovate:", uniqueEpoche);
        console.log("Provenienze trovate:", uniqueProvenienze);
      } else {
        console.error('Nessun dato trovato nel catalogo.');
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dati del catalogo:', error);
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
    let result = [...arrayCatalogo];
    
    // Applica filtro per categoria
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.categoria === selectedCategory);
    }
    
    // Applica filtro per epoca
    if (selectedEpoca !== 'all') {
      result = result.filter(item => item.epoca === selectedEpoca);
    }
    
    // Applica filtro per provenienza
    if (selectedProvenienza !== 'all') {
      result = result.filter(item => item.provenienza === selectedProvenienza);
    }
    
    // Applica filtro per ricerca testuale
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.nome?.toLowerCase().includes(term) || false) || 
        (item.descrizione?.toLowerCase().includes(term) || false) ||
        (item.provenienza?.toLowerCase().includes(term) || false) ||
        (item.categoria?.toLowerCase().includes(term) || false) ||
        (item.epoca?.toLowerCase().includes(term) || false)
      );
    }
    
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
      case 'epoca-asc': 
        result.sort((a, b) => (a.epoca || '').localeCompare(b.epoca || ''));
        break;
      case 'epoca-desc':
        result.sort((a, b) => (b.epoca || '').localeCompare(a.epoca || ''));
        break;
      case 'evidenza':
        // Elementi in evidenza prima
        result.sort((a, b) => {
          if (a.inEvidenza && !b.inEvidenza) return -1;
          if (!a.inEvidenza && b.inEvidenza) return 1;
          return 0;
        });
        break;
      case 'rarità':
        // Elementi rari prima
        result.sort((a, b) => {
          if (a.isRaro && !b.isRaro) return -1;
          if (!a.isRaro && b.isRaro) return 1;
          return 0;
        });
        break;
      default:
        // Mantieni l'ordine originale
        break;
    }
    
    setFilteredItems(result);
  }, [arrayCatalogo, selectedCategory, selectedEpoca, selectedProvenienza, searchTerm, sortBy]);

  // Carica più elementi
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  // Ottieni icona per categoria
  const getCategoryIcon = (category) => {
    // Icone per categorie comuni - usando Font Awesome
    switch(category) {
      case 'Mobili': return 'fas fa-couch';
      case 'Quadri': return 'fas fa-paint-brush';
      case 'Ceramiche': return 'fas fa-wine-glass-alt';
      case 'Statue': return 'fas fa-chess-knight';
      case 'Orologi': return 'fas fa-clock';
      case 'Gioielli': return 'fas fa-gem';
      case 'Argenti': return 'fas fa-utensils';
      case 'Libri': return 'fas fa-book';
      case 'Mappe': return 'fas fa-map';
      case 'Monete': return 'fas fa-coins';
      case 'Tappeti': return 'fas fa-border-all';
      case 'Vetro': return 'fas fa-wine-glass';
      default: return 'fas fa-tag';
    }
  };
  
  // Ottieni icona per epoca
  const getEpochIcon = (epoch) => {
    // Icone per epoche comuni - usando Font Awesome
    switch(epoch) {
      case 'Medioevo': return 'fas fa-chess-rook';
      case 'Rinascimento': return 'fas fa-drafting-compass';
      case 'Barocco': return 'fas fa-church';
      case 'Rococò': return 'fas fa-feather-alt';
      case 'Neoclassico': return 'fas fa-columns';
      case 'Art Nouveau': return 'fas fa-leaf';
      case 'Art Déco': return 'fas fa-city';
      case 'Moderno': return 'fas fa-square';
      case 'Contemporaneo': return 'fas fa-cubes';
      default: return 'fas fa-history';
    }
  };
  
  // Formatta l'epoca per la visualizzazione
  const formatEpoch = (epoch) => {
    if (!epoch) return 'Epoca sconosciuta';
    
    // Se l'epoca include già info come secolo/anni, la manteniamo
    if (epoch.includes('secolo') || /\d{2,4}/.test(epoch)) {
      return epoch;
    }
    
    // Mapping per epoche comuni con date approssimative
    const epochDates = {
      'Medioevo': 'V-XV secolo',
      'Rinascimento': 'XV-XVI secolo',
      'Barocco': 'XVII secolo',
      'Rococò': 'XVIII secolo',
      'Neoclassico': 'XVIII-XIX secolo',
      'Art Nouveau': '1890-1910',
      'Art Déco': '1920-1940',
      'Moderno': '1940-1970',
      'Contemporaneo': 'Post 1970'
    };
    
    return epochDates[epoch] ? `${epoch} (${epochDates[epoch]})` : epoch;
  };

  return (
    <section className="catalogo-section py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="section-header">
          <h2 className="catalogo-title">Catalogo Antiquariato</h2>
          <p className="section-subtitle">Esplora la nostra collezione di pezzi unici e dal valore storico</p>
        </div>

        {/* Barra delle opzioni di visualizzazione */}
        <div className="view-options">
          <div className="view-mode-switch">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
              aria-label="Visualizzazione a griglia"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
              </svg>
              <span>Griglia</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
              aria-label="Visualizzazione a lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
              <span>Lista</span>
            </button>
          </div>
          
          {/* Dimensioni card - visibile solo in modalità griglia */}
          {viewMode === 'grid' && (
            <div className="card-size-switch">
              <span className="size-label">Dimensione</span>
              <button 
                className={`size-btn ${cardSize === 'small' ? 'active' : ''}`} 
                onClick={() => setCardSize('small')}
                aria-label="Card piccole"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
                </svg>
              </button>
              <button 
                className={`size-btn ${cardSize === 'medium' ? 'active' : ''}`} 
                onClick={() => setCardSize('medium')}
                aria-label="Card medie"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button 
                className={`size-btn ${cardSize === 'large' ? 'active' : ''}`} 
                onClick={() => setCardSize('large')}
                aria-label="Card grandi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5zM1 9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H1z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Barra di filtri e ricerca */}
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cerca per nome, descrizione, categoria o provenienza..."
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
            {/* Filtro per categoria */}
            {categories.length > 0 && (
              <div className="filter-group">
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
                <span className="filter-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                    <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                  </svg>
                </span>
              </div>
            )}
            
            {/* Filtro per epoca */}
            {epoche.length > 0 && (
              <div className="filter-group">
                <select 
                  className="filter-select"
                  value={selectedEpoca}
                  onChange={(e) => setSelectedEpoca(e.target.value)}
                >
                  <option value="all">Tutte le epoche</option>
                  {epoche.map((epoca, index) => (
                    <option key={index} value={epoca}>{epoca}</option>
                  ))}
                </select>
                <span className="filter-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                  </svg>
                </span>
              </div>
            )}
            
            {/* Filtro per provenienza */}
            {provenienze.length > 0 && (
              <div className="filter-group">
                <select 
                  className="filter-select"
                  value={selectedProvenienza}
                  onChange={(e) => setSelectedProvenienza(e.target.value)}
                >
                  <option value="all">Tutte le provenienze</option>
                  {provenienze.map((provenienza, index) => (
                    <option key={index} value={provenienza}>{provenienza}</option>
                  ))}
                </select>
                <span className="filter-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </span>
              </div>
            )}
            
            {/* Ordinamento */}
            <div className="filter-group">
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Ordinamento predefinito</option>
                <option value="name-asc">Nome: A-Z</option>
                <option value="name-desc">Nome: Z-A</option>
                <option value="epoca-asc">Epoca: dalla più antica</option>
                <option value="epoca-desc">Epoca: dalla più recente</option>
                <option value="price-asc">Prezzo: dal più basso</option>
                <option value="price-desc">Prezzo: dal più alto</option>
                <option value="evidenza">Pezzi in evidenza</option>
                <option value="rarità">Pezzi rari</option>
              </select>
              <span className="filter-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Filtri attivi */}
        {(searchTerm || selectedCategory !== 'all' || selectedEpoca !== 'all' || selectedProvenienza !== 'all') && (
          <div className="active-filters">
            <span className="active-filters-label">Filtri attivi:</span>
            <div className="active-filter-tags">
              {searchTerm && (
                <div className="filter-tag">
                  <span>Ricerca: {searchTerm}</span>
                  <button onClick={() => setSearchTerm('')} aria-label="Rimuovi filtro">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {selectedCategory !== 'all' && (
                <div className="filter-tag">
                  <span>Categoria: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} aria-label="Rimuovi filtro">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {selectedEpoca !== 'all' && (
                <div className="filter-tag">
                  <span>Epoca: {selectedEpoca}</span>
                  <button onClick={() => setSelectedEpoca('all')} aria-label="Rimuovi filtro">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {selectedProvenienza !== 'all' && (
                <div className="filter-tag">
                  <span>Provenienza: {selectedProvenienza}</span>
                  <button onClick={() => setSelectedProvenienza('all')} aria-label="Rimuovi filtro">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className="reset-all-filters" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedEpoca('all');
                setSelectedProvenienza('all');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Reimposta tutti
            </button>
          </div>
        )}


{/* Statistiche del catalogo */}
        <div className="catalogo-stats">
          <div className="stats-item">
            <span className="stats-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.98 1a.5.5 0 0 0-.39.188L1.54 5H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0A.5.5 0 0 1 10 5h4.46l-3.05-3.812A.5.5 0 0 0 11.02 1H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562A.5.5 0 0 0 1.884 9h12.234a.5.5 0 0 0 .496-.438L14.933 6zM3.809.563A1.5 1.5 0 0 1 4.981 0h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 10H1.883A1.5 1.5 0 0 1 .394 8.686l-.39-3.124a.5.5 0 0 1 .106-.374L3.81.563zM.125 11.17A.5.5 0 0 1 .5 11H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0 .5.5 0 0 1 .5-.5h5.5a.5.5 0 0 1 .496.562l-.39 3.124A1.5 1.5 0 0 1 14.117 16H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .121-.393z"/>
              </svg>
            </span>
            <span className="stats-number">{arrayCatalogo.length}</span>
            <span className="stats-label">Pezzi nel catalogo</span>
          </div>
          <div className="stats-item">
            <span className="stats-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
              </svg>
            </span>
            <span className="stats-number">{categories.length}</span>
            <span className="stats-label">Categorie</span>
          </div>
          <div className="stats-item">
            <span className="stats-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
            </span>
            <span className="stats-number">{epoche.length}</span>
            <span className="stats-label">Epoche storiche</span>
          </div>
          <div className="stats-item">
            <span className="stats-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
            <span className="stats-number">{filteredItems.length}</span>
            <span className="stats-label">Risultati</span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Caricamento del catalogo in corso...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              // Visualizzazione a griglia con nuove card eleganti
              <div className={`row gx-4 gx-lg-5 row-cols-1 row-cols-sm-2 ${cardSize === 'small' ? 'row-cols-md-4 row-cols-xl-5' : (cardSize === 'large' ? 'row-cols-md-2 row-cols-xl-3' : 'row-cols-md-3 row-cols-xl-4')} justify-content-center`}>
                {filteredItems.slice(0, visibleCount).map((item, index) => (
                  <div className={`col mb-5 card-animation ${cardSize}`} key={index}>
                    <div className="antiquariato-card">
                      <div className="card-image-wrapper">
                        <img src={item.immagineUrl} alt={item.nome} className="card-image" />
                        
                        {/* Badge per elementi rari o in evidenza (simulati in questo esempio) */}
                        {item.isRaro && (
                          <span className="item-badge rare-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                            </svg> Raro
                          </span>
                        )}
                        {!item.isRaro && item.inEvidenza && (
                          <span className="item-badge featured-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg> In evidenza
                          </span>
                        )}
                        
                        {/* Icona categoria */}
                        <span className="category-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={getCategoryIcon(item.categoria)} viewBox="0 0 16 16">
                            <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                            <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                          </svg>
                        </span>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="card-title">{item.nome}</h3>
                        
                        <div className="card-meta">
                          <span className="card-categoria">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className={getCategoryIcon(item.categoria)} viewBox="0 0 16 16">
                              <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                              <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                            </svg> {item.categoria}
                          </span>
                          <span className="card-epoca">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className={getEpochIcon(item.epoca)} viewBox="0 0 16 16">
                              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                            </svg> {item.epoca || 'Non specificata'}
                          </span>
                        </div>
                        
                        <p className="card-description">{item.descrizione?.substring(0, cardSize === 'small' ? 50 : (cardSize === 'large' ? 150 : 100))}...</p>
                        
                        <div className="card-provenienza">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                          </svg> {item.provenienza || 'Provenienza sconosciuta'}
                        </div>
                        
                        <a href={`/dettaglio/${item.id}`} className="card-link">
                          Scopri di più
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Visualizzazione a lista migliorata
              <div className="catalog-list-view">
                {filteredItems.slice(0, visibleCount).map((item, index) => (
                  <div className="list-item" key={index}>
                    <div className="list-item-image">
                      <img src={item.immagineUrl} alt={item.nome} />
                      
                      {/* Badge per elementi rari o in evidenza */}
                      {item.isRaro && (
                        <span className="item-badge rare-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                          </svg> Raro
                        </span>
                      )}
                      {!item.isRaro && item.inEvidenza && (
                        <span className="item-badge featured-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg> In evidenza
                        </span>
                      )}
                    </div>
                    <div className="list-item-details">
                      <h3 className="list-item-title">{item.nome}</h3>
                      <div className="list-item-meta">
                        <span className="list-item-category">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className={getCategoryIcon(item.categoria)} viewBox="0 0 16 16">
                            <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
                            <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
                          </svg> {item.categoria}
                        </span>
                        <span className="list-item-epoch">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className={getEpochIcon(item.epoca)} viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                          </svg> {formatEpoch(item.epoca)}
                        </span>
                      </div>
                      <p className="list-item-description">{item.descrizione?.substring(0, 200)}...</p>
                      <div className="list-item-specs">
                        <div className="spec-item">
                          <span className="spec-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg> Provenienza:
                          </span>
                          <span className="spec-value">{item.provenienza || 'Non specificata'}</span>
                        </div>
                        {item.prezzo && (
                          <div className="spec-item">
                            <span className="spec-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                              </svg> Prezzo:
                            </span>
                            <span className="spec-value">{item.prezzo}</span>
                          </div>
                        )}
                      </div>
                      <a href={`/dettaglio/${item.id}`} className="list-item-link">
                        Scopri di più 
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {visibleCount < filteredItems.length && (
              <div className="text-center mt-4">
                <button className="load-more-btn" onClick={loadMore}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  Mostra altri pezzi
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
            <p>Nessun risultato trovato. Prova a modificare i filtri di ricerca.</p>
            <button 
              className="reset-filters-btn" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedEpoca('all');
                setSelectedProvenienza('all');
                setSortBy('default');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Reimposta tutti i filtri
            </button>
          </div>
        )}

        {/* Pulsante per tornare all'inizio della pagina */}
        <button 
          className="back-to-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Torna all'inizio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Catalogo;
