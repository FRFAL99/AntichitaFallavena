// src/components/catalog/CatalogItemGrid.js
import React from 'react';
import Card from '../../components/Card.js'; // Assicurati che il percorso sia corretto

const CatalogItemGrid = ({ items, visibleCount, cardSize }) => {
  // Determina le classi di Bootstrap in base alla dimensione della card
  const getColumnClasses = () => {
    switch(cardSize) {
      case 'small':
        return 'row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-xl-5';
      case 'large':
        return 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3';
      default: // medium
        return 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4';
    }
  };

  return (
    <div className={`row gx-4 gx-lg-5 ${getColumnClasses()} justify-content-center`}>
      {items.slice(0, visibleCount).map((item, index) => (
        <div className={`col mb-5 card-animation ${cardSize}`} key={item.id || index}>
          <Card
            id={item.id}
            nome={item.nome}
            foto={item.immagineUrl} 
            descrizione={item.descrizione}
            prezzo={item.prezzo}
            categoria={item.categoria}
            epoca={item.epoca}
          />
        </div>
      ))}
    </div>
  );
};

export default CatalogItemGrid;