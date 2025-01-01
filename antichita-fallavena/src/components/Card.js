import React from 'react';

const Card = ({ nome, foto, descrizione, prezzo, link, truncate = true }) => {
  // Funzione per troncare il testo (descrizione) se necessario
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="col mb-5">
      <div className="card bacheca-card h-100">
        <img className="card-img-top" src={foto} alt={nome} />
        <div className="card-body p-4">
          <div className="text-center">
            <h5 className="fw-bolder">{nome}</h5>
            <p>{truncate ? truncateText(descrizione, 90) : descrizione}</p>
            {prezzo && <p><strong>€{prezzo}</strong></p>}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <a className="btn btn-outline-dark mt-auto" href={link}>View options</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
