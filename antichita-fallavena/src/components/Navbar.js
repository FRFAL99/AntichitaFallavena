import React from 'react';
import { Link } from 'react-router-dom';
import flgIT from '../assets/images/flags/it.svg';
import flgUK from '../assets/images/flags/gb.svg';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid d-flex justify-content-between">
      <a className="navbar-brand" href="/">
        <img src={logo} alt="Antichità Fallavena" className="img-fluid" style={{ maxHeight: '40px' }} />
      </a>
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
            <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ChiSiamo">Chi Siamo</Link></li>
            <li className="nav-item"><a className="nav-link" href="#!">Eventi</a></li>
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
                <li><Link className="nav-link" to="/Catalogo">Tutti i prodotti</Link></li>
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
  );
};

export default Navbar;
