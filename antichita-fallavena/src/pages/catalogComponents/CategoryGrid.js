// src/components/catalog/CategoryGrid.js
import React from 'react';
import { getCategoryIcon } from './utils/categoryUtils';
import './CssCatalog/CategoryGrid.css'

const CategoryGrid = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="category-showcase">
      <h3 className="category-showcase-title">Esplora per categoria</h3>
      <div className="category-grid">
        <div 
          className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <div className="category-icon-wrapper">
            <i className="fas fa-th-large"></i>
          </div>
          <span className="category-name">Tutte le categorie</span>
        </div>
        
        {categories.map((category, index) => (
          <div 
            key={index} 
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            <div className="category-icon-wrapper">
              <i className={getCategoryIcon(category)}></i>
            </div>
            <span className="category-name">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;