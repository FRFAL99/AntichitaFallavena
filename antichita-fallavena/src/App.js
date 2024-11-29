import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';
import annunci from './data/Bacheca.json';

import foto1 from './assets/images/carosello/foto1.png';
import foto2 from './assets/images/carosello/foto2.png';
import foto3 from './assets/images/carosello/foto3.png';

import flgIT from './assets/images/flags/it.svg';
import flgUK from './assets/images/flags/gb.svg';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function App() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid d-flex justify-content-between">
          <a className="navbar-brand" href="#!">Antichità Fallavena</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#!">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">Chi Siamo</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">Eventi</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Catalogo
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#!">Tutti i Prodotti</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#!">Offerte</a></li>
                </ul>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="languageDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Lingua
                </a>
                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                  <a className="dropdown-item" href="?lang=it">
                    <img src={flgIT} alt="Italiano" style={{ width: 20, height: "auto" }} /> Italiano
                  </a>
                  <a className="dropdown-item" href="?lang=en">
                    <img src={flgUK} alt="Inglese" style={{ width: 20, height: "auto" }} /> English
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel */}
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

      {/* Section */}
      <section className="bacheca-section py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="bacheca-title mb-4">In Evidenza:</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {annunci.map((annuncio, index) => (
              <div className="col mb-5" key={index}>
                <div className="card bacheca-card h-100">
                  <img className="card-img-top" src={annuncio.foto} alt={annuncio.nome} />
                  <div className="card-body p-4">
                    <div className="text-center">
                      <h5 className="fw-bolder">{annuncio.nome}</h5>
                      <p>{truncateText(annuncio.descrizione, 90)}</p>
                    </div>
                  </div>
                  <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center">
                      <a className="btn btn-outline-dark mt-auto" href="#">View options</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Contatti</h5>
              <ul className="list-unstyled">
                <li>Email: <a href="mailto:info@tuosito.com">info@tuosito.com</a></li>
                <li>Telefono: <a href="tel:+1234567890">+123 456 7890</a></li>
                <li>Indirizzo: Via Roma 123, Milano</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Orari di Apertura</h5>
              <ul className="list-unstyled">
                <li>Lun-Ven: 9:00 - 18:00</li>
                <li>Sab: 10:00 - 14:00</li>
                <li>Dom: Chiuso</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Seguici</h5>
              <a href="#"><i className="bi bi-facebook" /></a>
              <a href="#"><i className="bi bi-twitter" /></a>
              <a href="#"><i className="bi bi-instagram" /></a>
            </div>
          </div>
          <div className="text-center text-white mt-4">
            <p className="m-0">Copyright © Antichità Fallavena 2025</p>
            <a href="#" className="text-white">Termini e Condizioni</a> |
            <a href="#" className="text-white" onClick={() => alert('Privacy Policy')}>Privacy Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
