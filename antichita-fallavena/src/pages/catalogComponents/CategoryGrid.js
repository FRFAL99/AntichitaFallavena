// src/components/catalog/CategoryGrid.js
import React from 'react';
import { getCategoryIcon } from './utils/categoryUtils';
import './CssCatalog/CategoryGrid.css';

const CategoryGrid = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-explorer-container">
      <h3 className="explorer-title">Esplora per categoria</h3>
      <div className="category-explorer-grid">
        {/* Card "Tutte le categorie" */}
        <div 
          className="all-categories-card" 
          onClick={() => onSelectCategory('all')}
        >
          <div className="all-categories-icon">
            <div className="circle">
              <i className="fas fa-th"></i>
            </div>
          </div>
          <h4>Tutte le categorie</h4>
        </div>
        
        {/* Mostra fino a 3 categorie */}
        {categories.slice(0, 3).map((category, index) => (
          <div 
            key={index} 
            className={`category-explorer-card ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            <div className="category-icon">
              <div className="circle">
                <i className={getCategoryIcon(category)}></i>
              </div>
            </div>
            <h4>{category}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;