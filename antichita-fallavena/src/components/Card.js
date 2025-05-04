import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSScomponents/Card.css';

const Card = ({ nome, foto, descrizione, prezzo, categoria, epoca, id, cardSize = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Formatta il prezzo in Euro
  const formatPrice = (price) => {
    if (!price) return "Prezzo su richiesta";
    
    if (typeof price === 'string' && price.includes('€')) {
      return price;
    }
    
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Tronca la descrizione in base alla dimensione della card
  const truncateDescription = (text) => {
    if (!text) return "";
    
    // Lunghezza massima in base alla dimensione della card
    const maxLength = cardSize === 'small' ? 50 : (cardSize === 'large' ? 150 : 100);
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Aggiungi la classe della dimensione alla card
  const cardClasses = `product-card product-card-${cardSize}`;

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-img-container">
        <img 
          className="card-img" 
          src={foto || 'https://via.placeholder.com/300x200?text=Immagine+non+disponibile'} 
          alt={nome} 
        />
        
        {/* Badge categoria - sempre visibile */}
        {categoria && (
          <span className="product-category">{categoria}</span>
        )}
        
        {/* Badge epoca - visibile se disponibile */}
        {epoca && (
          <span className="product-epoca">{epoca}</span>
        )}
        
        <div className={`card-overlay ${isHovered ? 'visible' : ''}`}>
          <div className="card-actions">
            <Link to={`/prodotto/${id}`} className="card-btn view-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
              Dettagli
            </Link>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="product-title">{nome || "Antiquariato"}</h3>
        <p className="product-description">{truncateDescription(descrizione)}</p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(prezzo)}</span>
          <Link to={`/prodotto/${id}`} className="details-link">
            Scopri di più
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;