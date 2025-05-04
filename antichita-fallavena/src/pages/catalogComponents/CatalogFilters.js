// src/components/catalog/CatalogFilters.js
import React from 'react';
import './CssCatalog/CatalogFilters.css'

const CatalogFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  selectedEpoca, 
  setSelectedEpoca, 
  selectedProvenienza, 
  setSelectedProvenienza, 
  sortBy,
  setSortBy, 
  categories, 
  epoche, 
  provenienze 
}) => {
  return (
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
  );
};

export default CatalogFilters;