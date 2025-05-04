// src/components/catalog/Loading.js
import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Caricamento del catalogo in corso...</p>
    </div>
  );
};

export default Loading;