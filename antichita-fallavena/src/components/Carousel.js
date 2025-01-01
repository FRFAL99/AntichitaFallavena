import React from 'react';
import foto1 from '../assets/images/carosello/foto1.png';
import foto2 from '../assets/images/carosello/foto2.png';
import foto3 from '../assets/images/carosello/foto3.png';

const Carousel = () => {
  return (
    <header>
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          {[foto1, foto2, foto3].map((foto, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
              <img src={foto} className="d-block w-100" alt={`Immagine ${index + 1}`} />
              <div className="carousel-caption d-none d-md-block">
                <h5>Titolo Immagine {index + 1}</h5>
                <p>Descrizione per l'immagine {index + 1}.</p>
                <a href="#" className="btn btn-primary">Scopri di più</a>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </header>
  );
};

export default Carousel;
