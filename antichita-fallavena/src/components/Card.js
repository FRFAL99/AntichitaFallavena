import React from 'react';

const Card = ({ nome, foto, descrizione, prezzo, link, truncate = true }) => {
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // const convertDriveLink = (url) => {
  //   const match = url.match(/\/d\/(.*?)\//);
  //   return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
  // };  

  const handleImageError = (e) => {
    console.error("Errore nel caricamento dell'immagine:", foto);
    e.target.src = 'https://via.placeholder.com/360'; // Fallback
  };

  console.log("Rendering foto:", foto);

  return (
    <div className="col mb-5">
      <div className="card bacheca-card h-100">
        <img
          className="card-img-top"
          src={foto}
          alt={nome}
          onError={handleImageError}
        />
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
