// src/components/catalog/FeaturedCategories.js
import React from 'react';
import { getCategoryIcon } from './utils/categoryUtils';
import './CssCatalog/FeaturedCategories.css';

const FeaturedCategories = ({ categories, onSelectCategory }) => {
  // Seleziona fino a 6 categorie principali da mostrare
  const mainCategories = categories.slice(0, Math.min(6, categories.length));
  
  return (
    <div className="featured-categories">
      <h3 className="featured-title">Categorie principali</h3>
      <div className="featured-categories-grid">
        {mainCategories.map((category, index) => (
          <div 
            key={index} 
            className="featured-category-card" 
            onClick={() => onSelectCategory(category)}
          >
            <div className="featured-category-image">
              <img 
                src={`https://via.placeholder.com/300x200?text=${category}`} 
                alt={category} 
              />
              <div className="featured-category-overlay">
                <i className={getCategoryIcon(category)}></i>
                <h4>{category}</h4>
                <span className="view-category">Esplora collezione</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;