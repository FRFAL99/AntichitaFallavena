// src/components/catalog/LoadMoreButton.js
import React from 'react';

const LoadMoreButton = ({ visibleCount, totalItems, loadMore }) => {
  // Se non ci sono più elementi da caricare, non mostrare il pulsante
  if (visibleCount >= totalItems) return null;
  
  return (
    <div className="text-center mt-4">
      <button className="load-more-btn" onClick={loadMore}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Mostra altri pezzi
      </button>
    </div>
  );
};

export default LoadMoreButton;