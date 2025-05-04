// src/components/catalog/EpochsShowcase.js
import React from 'react';
import { getEpochIcon, formatEpoch } from './utils/epochUtils';
import './CssCatalog/EpochsShowcase.css'

const EpochsShowcase = ({ epoche, onSelectEpoch }) => {
  return (
    <div className="epochs-showcase">
      <h3 className="epochs-title">Esplora per epoca</h3>
      <div className="epochs-timeline">
        {epoche.map((epoca, index) => (
          <div 
            key={index} 
            className="epoch-item" 
            onClick={() => onSelectEpoch(epoca)}
          >
            <div className="epoch-icon">
              <i className={getEpochIcon(epoca)}></i>
            </div>
            <div className="epoch-info">
              <h4>{epoca}</h4>
              <p>{formatEpoch(epoca).replace(epoca, '')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpochsShowcase;