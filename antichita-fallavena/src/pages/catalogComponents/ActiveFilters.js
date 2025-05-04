// src/components/catalog/ActiveFilters.js
import React from 'react';
import './CssCatalog/ActiveFilters.css';


const ActiveFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  selectedEpoca, 
  setSelectedEpoca, 
  selectedProvenienza, 
  setSelectedProvenienza 
}) => {
  
  // Verifica se ci sono filtri attivi
  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedEpoca !== 'all' || selectedProvenienza !== 'all';
  
  if (!hasActiveFilters) return null;
  
  return (
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
  );
};

export default ActiveFilters;