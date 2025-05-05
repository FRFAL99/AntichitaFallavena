// src/components/catalog/EpochsShowcase.js
import React from 'react';
import { getEpochIcon, formatEpoch, getEpochBackground } from './utils/epochUtils';
import './CssCatalog/EpochsShowcase.css'

const EpochsShowcase = ({ epoche, onSelectEpoch }) => {
  // Seleziona fino a 4 epoche principali da mostrare
  const mainEpoche = epoche.slice(0, Math.min(4, epoche.length));
  
  return (
    <div className="epochs-showcase-container">
      <h3 className="epochs-title">Epoche storiche</h3>
      <div className="epochs-grid">
        {mainEpoche.map((epoch, index) => (
          <div 
            key={index} 
            className="epoch-card" 
            onClick={() => onSelectEpoch(epoch)}
          >
            <div className="epoch-image">
              <img 
                src={getEpochBackground(epoch)}
                alt={epoch}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/500x200?text=${epoch}`;
                }}
              />
              <div className="epoch-overlay">
                <i className={getEpochIcon(epoch)}></i>
                <h4>{epoch}</h4>
                <span className="epoch-period">{formatEpoch(epoch)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {epoche.length > 4 && (
        <div className="view-more-epochs">
          <button 
            className="view-all-epochs-btn" 
            onClick={() => onSelectEpoch('all')}
          >
            Visualizza tutte le epoche
          </button>
        </div>
      )}
    </div>
  );
};

export default EpochsShowcase;