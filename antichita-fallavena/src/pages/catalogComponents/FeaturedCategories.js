// src/components/catalog/FeaturedCategories.js
import React from 'react';
import { getCategoryIcon, getCategoryBackground } from './utils/categoryUtils';
import './CssCatalog/FeaturedCategories.css';

const FeaturedCategories = ({ categories, onSelectCategory }) => {
  // Seleziona fino a 3 categorie principali da mostrare
  const mainCategories = categories.slice(0, Math.min(3, categories.length));
  
  return (
    <div className="featured-categories-container">
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
                src={getCategoryBackground(category)} 
                alt={category} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/500x300?text=${category}`;
                }}
              />
              <div className="featured-category-overlay">
                <i className={getCategoryIcon(category)}></i>
                <h4>{category}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;