import React from 'react';
import { Link } from 'react-router-dom';
import './CSSpages/ChiSiamo.css';

// Importa le immagini che userai
// import shopImage from '../assets/images/shop-exterior.jpg';
// import ownerImage from '../assets/images/owner.jpg';
// import antiquesImage from '../assets/images/antiques-collection.jpg';

const ChiSiamo = () => {
  return (
    <div className="chi-siamo-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1>Chi Siamo</h1>
              <p className="lead">
                Da oltre 50 anni, passione per l'antico e amore per il bello
              </p>
            </div>
            <div className="col-lg-6">
              {/* <img src={shopImage} alt="Antichità Fallavena" className="img-fluid rounded shadow" /> */}
              <div className="placeholder-image" style={{height: '400px', backgroundColor: '#f8f9fa'}}>
                [Immagine del negozio]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storia Section */}
      <section className="storia-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="text-center mb-4">La Nostra Storia</h2>
              <p>
                Antichità Fallavena nasce nel 1970 dalla passione di Giovanni Fallavena 
                per il restauro e la conservazione di mobili e oggetti d'epoca. Situato 
                nel cuore di Verona, il nostro negozio è diventato un punto di riferimento 
                per collezionisti, arredatori e appassionati d'arte.
              </p>
              <p>
                Con oltre cinquant'anni di esperienza, continuiamo a preservare la tradizione 
                artigianale veneta, offrendo pezzi autentici accuratamente selezionati e 
                restaurati nei nostri laboratori.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valori Section */}
      <section className="valori-section bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">I Nostri Valori</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-award fs-1 text-primary mb-3"></i>
                  <h4>Autenticità</h4>
                  <p>Garantiamo la provenienza e l'autenticità di ogni pezzo della nostra collezione</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-heart fs-1 text-primary mb-3"></i>
                  <h4>Passione</h4>
                  <p>L'amore per l'arte e la storia guida ogni nostra scelta e consiglio</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-tools fs-1 text-primary mb-3"></i>
                  <h4>Restauro</h4>
                  <p>Tecniche tradizionali per preservare la bellezza originale degli oggetti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contatti Section */}
      <section className="contatti-section bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="mb-4">Dove Trovarci</h2>
              <div className="mb-4">
                <h5><i className="bi bi-geo-alt me-2"></i>Indirizzo</h5>
                <p>Via dell'Antiquariato, 123<br />37121 Verona (VR)</p>
              </div>
              <div className="mb-4">
                <h5><i className="bi bi-telephone me-2"></i>Telefono</h5>
                <p>+39 045 123 4567</p>
              </div>
              <div className="mb-4">
                <h5><i className="bi bi-envelope me-2"></i>Email</h5>
                <p>info@antichitafallavena.it</p>
              </div>
              <div className="mb-4">
                <h5><i className="bi bi-clock me-2"></i>Orari di Apertura</h5>
                <p>
                  Lunedì - Sabato: 9:30 - 13:00, 15:00 - 19:30<br />
                  Domenica: Chiuso
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="map-container">
                {/* Qui puoi inserire una mappa Google o un'immagine statica */}
                <div className="placeholder-image rounded" style={{height: '400px', backgroundColor: '#e9ecef'}}>
                  [Mappa del negozio]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <h2 className="mb-4">Scopri le Nostre Collezioni</h2>
          <p className="lead mb-4">
            Esplora il nostro catalogo online o vieni a trovarci in negozio
          </p>
          <Link to="/Catalogo" className="btn btn-primary btn-lg">
            Vai al Catalogo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;