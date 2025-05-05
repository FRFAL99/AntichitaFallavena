import React, { useState, useEffect } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';
import './CSSpages/Catalogo.css';

// Importazione dei componenti
import CategoryGrid from './catalogComponents/CategoryGrid';
import FeaturedCategories from './catalogComponents/FeaturedCategories';
import EpochsShowcase from './catalogComponents/EpochsShowcase';
import CatalogFilters from './catalogComponents/CatalogFilters';
import ActiveFilters from './catalogComponents/ActiveFilters';
import CatalogStats from './catalogComponents/CatalogStats';
import ViewOptions from './catalogComponents/ViewOptions';
import CatalogItemGrid from './catalogComponents/CatalogItemGrid';
import CatalogItemList from './catalogComponents/CatalogItemList';
import LoadMoreButton from './catalogComponents/LoadMoreButton';
import NoResults from './catalogComponents/NoResults';
import BackToTopButton from './catalogComponents/BackToTopButton';
import Loading from './catalogComponents/Loading';
import LatestArrivals from './catalogComponents/LatestArrivals';

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
  const [showFullCatalog, setShowFullCatalog] = useState(false); // Se mostrare il catalogo completo

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
            id: key
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
      // Quando si seleziona una categoria specifica, mostra il catalogo completo
      setShowFullCatalog(true);
    }
    
    // Applica filtro per epoca
    if (selectedEpoca !== 'all') {
      result = result.filter(item => item.epoca === selectedEpoca);
      // Quando si seleziona un'epoca specifica, mostra il catalogo completo
      setShowFullCatalog(true);
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
      // Quando si esegue una ricerca, mostra sempre il catalogo completo
      setShowFullCatalog(true);
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

  // Funzione per caricare più elementi
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  // Gestisci la selezione di una categoria
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Mostra il catalogo completo quando si seleziona una categoria
    setShowFullCatalog(true);
    // Torna all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Gestisci la selezione di un'epoca
  const handleEpochSelect = (epoch) => {
    setSelectedEpoca(epoch);
    // Mostra il catalogo completo quando si seleziona un'epoca
    setShowFullCatalog(true);
    // Torna all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Funzione per mostrare il catalogo completo
  const showCatalog = () => {
    setShowFullCatalog(true);
    // Torna all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Funzione per tornare alle categorie
  const backToCategories = () => {
    setShowFullCatalog(false);
    setSelectedCategory('all');
    setSelectedEpoca('all');
    setSelectedProvenienza('all');
    setSearchTerm('');
    // Torna all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Funzione per reimpostare tutti i filtri
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedEpoca('all');
    setSelectedProvenienza('all');
    setSortBy('default');
  };

  return (
    <section className="catalogo-section py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="section-header">
          <h2 className="catalogo-title">Catalogo Antiquariato</h2>
          <p className="section-subtitle">Esplora la nostra collezione di pezzi unici e dal valore storico</p>
        </div>

        {/* Schermata iniziale: Visualizzazione categorie */}
        {!showFullCatalog && !isLoading && (
          <>
            {/* Ultimi arrivi - Nuova sezione aggiunta in alto */}
              <LatestArrivals 
                items={arrayCatalogo} 
              />

            {/* Categorie principali con immagini */}
            <FeaturedCategories 
              categories={categories} 
              onSelectCategory={handleCategorySelect} 
            />
            
            {/* Griglia completa di categorie */}
            <CategoryGrid 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
            
            {/* Showcase delle epoche */}
            <EpochsShowcase 
              epoche={epoche}
              onSelectEpoch={handleEpochSelect}
            />
            
            {/* Pulsante per visualizzare tutto il catalogo */}
            <div className="view-all-container">
              <button 
                className="view-all-btn" 
                onClick={showCatalog}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 .5Zm4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 4 .5Zm-4 2A.5.5 0 0 1 .5 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 4h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 8h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Z"/>
                </svg>
                Visualizza tutto il catalogo
              </button>
            </div>
          </>
        )}

        {/* Visualizzazione catalogo completo */}
        {showFullCatalog && (
          <>
            {/* Pulsante per tornare alle categorie */}
            <div className="back-to-categories-container">
              <button 
                className="back-to-categories-btn" 
                onClick={backToCategories}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Torna alle categorie
              </button>
            </div>

            {/* Opzioni di visualizzazione */}
            <ViewOptions 
              viewMode={viewMode}
              setViewMode={setViewMode}
              cardSize={cardSize}
              setCardSize={setCardSize}
            />

            {/* Filtri catalogo */}
            <CatalogFilters 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              selectedEpoca={selectedEpoca} 
              setSelectedEpoca={setSelectedEpoca} 
              selectedProvenienza={selectedProvenienza} 
              setSelectedProvenienza={setSelectedProvenienza} 
              sortBy={sortBy}
              setSortBy={setSortBy} 
              categories={categories} 
              epoche={epoche} 
              provenienze={provenienze}
            />

            {/* Filtri attivi */}
            <ActiveFilters 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              selectedEpoca={selectedEpoca} 
              setSelectedEpoca={setSelectedEpoca} 
              selectedProvenienza={selectedProvenienza} 
              setSelectedProvenienza={setSelectedProvenienza}
            />

            {/* Statistiche catalogo */}
            <CatalogStats 
              arrayCatalogo={arrayCatalogo}
              categories={categories}
              epoche={epoche}
              filteredItems={filteredItems}
            />

            {/* Contenuto catalogo */}
            {isLoading ? (
              <Loading />
            ) : filteredItems.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <CatalogItemGrid 
                    items={filteredItems}
                    visibleCount={visibleCount}
                    cardSize={cardSize}
                  />
                ) : (
                  <CatalogItemList 
                    items={filteredItems}
                    visibleCount={visibleCount}
                  />
                )}
                
                <LoadMoreButton 
                  visibleCount={visibleCount}
                  totalItems={filteredItems.length}
                  loadMore={loadMore}
                />
              </>
            ) : (
              <NoResults resetFilters={resetFilters} />
            )}
          </>
        )}

        {/* Pulsante per tornare all'inizio della pagina */}
        <BackToTopButton />
      </div>
    </section>
  );
};

export default Catalogo;